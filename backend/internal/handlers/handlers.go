package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Handler struct {
	mockData       *MockDataService
	users          *userStore
	jwtSecret      []byte
	totpIssuer     string
	accessTokenTTL time.Duration
}

func NewHandler() *Handler {
	issuer := os.Getenv("TOTP_ISSUER")
	if issuer == "" {
		issuer = "TradeSync"
	}
	ttl := 24 * time.Hour
	if val := os.Getenv("JWT_TTL_HOURS"); val != "" {
		if hours, err := time.ParseDuration(val + "h"); err == nil {
			ttl = hours
		}
	}
	return &Handler{
		mockData:       NewMockDataService(),
		users:          newUserStore(),
		jwtSecret:      loadJWTSecret(),
		totpIssuer:     issuer,
		accessTokenTTL: ttl,
	}
}

func (h *Handler) GetAccounts(w http.ResponseWriter, r *http.Request) {
	accounts := h.mockData.GetAccounts()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(accounts)
}

func (h *Handler) GetTrades(w http.ResponseWriter, r *http.Request) {
	trades := h.mockData.GetTrades()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trades)
}

func (h *Handler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats := h.mockData.GetStats()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

func (h *Handler) generateUserID() string {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err == nil {
		return fmt.Sprintf("user-%s", hex.EncodeToString(buf))
	}
	return fmt.Sprintf("user-%d", time.Now().UnixNano())
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
