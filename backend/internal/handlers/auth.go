package handlers

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/ananidze/trade-sync/backend/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
	"github.com/skip2/go-qrcode"
	"golang.org/x/crypto/bcrypt"
)

type userStore struct {
	mu    sync.RWMutex
	users map[string]*models.User
}

func newUserStore() *userStore {
	return &userStore{
		users: make(map[string]*models.User),
	}
}

func (s *userStore) getByEmail(email string) (*models.User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[strings.ToLower(email)]
	return u, ok
}

func (s *userStore) getByID(id string) (*models.User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, u := range s.users {
		if u.ID == id {
			return u, true
		}
	}
	return nil, false
}

func (s *userStore) save(user *models.User) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.users[strings.ToLower(user.Email)] = user
}

func (s *userStore) update(user *models.User) {
	s.save(user)
}

type authClaims struct {
	UserID        string `json:"userId"`
	Email         string `json:"email"`
	TwoFAVerified bool   `json:"twoFAVerified"`
	TokenType     string `json:"tokenType"`
	jwt.RegisteredClaims
}

type authContextKey string

const userContextKey authContextKey = "authedUser"

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		http.Error(w, "email and password are required", http.StatusBadRequest)
		return
	}

	if _, exists := h.users.getByEmail(req.Email); exists {
		http.Error(w, "user already exists", http.StatusConflict)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	user := &models.User{
		ID:           h.generateUserID(),
		Email:        req.Email,
		PasswordHash: hash,
		CreatedAt:    time.Now(),
	}

	h.users.save(user)

	writeJSON(w, http.StatusCreated, map[string]string{
		"message": "user registered successfully",
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	user, ok := h.users.getByEmail(req.Email)
	if !ok {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(req.Password)); err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	now := time.Now()
	user.LastLogin = &now
	h.users.update(user)

	if user.TwoFAEnabled && user.TwoFASecret != "" {
		pendingToken, err := h.createToken(user, false, "pending_2fa", 5*time.Minute)
		if err != nil {
			http.Error(w, "failed to create session", http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"requires2fa": true,
			"token":       pendingToken,
		})
		return
	}

	token, err := h.createToken(user, true, "access", h.accessTokenTTL)
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"requires2fa": false,
		"token":       token,
	})
}

func (h *Handler) EnableTwoFA(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      h.totpIssuer,
		AccountName: user.Email,
		Period:      30,
		SecretSize:  20,
		Algorithm:   otp.AlgorithmSHA1,
	})
	if err != nil {
		http.Error(w, "failed to generate secret", http.StatusInternalServerError)
		return
	}

	user.TwoFASecret = key.Secret()
	h.users.update(user)

	png, err := qrcode.Encode(key.URL(), qrcode.Medium, 256)
	if err != nil {
		http.Error(w, "failed to generate qr code", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"secret":     key.Secret(),
		"otpauthUrl": key.URL(),
		"qrCode":     "data:image/png;base64," + base64.StdEncoding.EncodeToString(png),
	})
}

func (h *Handler) VerifyTwoFA(w http.ResponseWriter, r *http.Request) {
	claims, err := h.extractTokenFromRequest(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	user, ok := h.users.getByID(claims.UserID)
	if !ok || user.TwoFASecret == "" {
		http.Error(w, "2fa not configured", http.StatusBadRequest)
		return
	}

	if !totp.Validate(req.Code, user.TwoFASecret) {
		http.Error(w, "invalid code", http.StatusUnauthorized)
		return
	}

	user.TwoFAEnabled = true
	h.users.update(user)

	token, err := h.createToken(user, true, "access", h.accessTokenTTL)
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"token":       token,
		"twoFAActive": true,
	})
}

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := h.extractTokenFromRequest(r)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		if claims.TokenType != "access" || !claims.TwoFAVerified {
			http.Error(w, "two-factor authentication required", http.StatusUnauthorized)
			return
		}

		user, ok := h.users.getByID(claims.UserID)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (h *Handler) extractTokenFromRequest(r *http.Request) (*authClaims, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return nil, errors.New("missing token")
	}
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return nil, errors.New("invalid auth header")
	}

	token, err := jwt.ParseWithClaims(parts[1], &authClaims{}, func(token *jwt.Token) (interface{}, error) {
		return h.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*authClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}
	return claims, nil
}

func (h *Handler) createToken(user *models.User, verified bool, tokenType string, ttl time.Duration) (string, error) {
	claims := authClaims{
		UserID:        user.ID,
		Email:         user.Email,
		TwoFAVerified: verified,
		TokenType:     tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(h.jwtSecret)
}

func userFromContext(ctx context.Context) *models.User {
	if ctx == nil {
		return nil
	}
	if user, ok := ctx.Value(userContextKey).(*models.User); ok {
		return user
	}
	return nil
}

func loadJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret-change-me"
	}
	return []byte(secret)
}
