package models

import "time"

// User represents a simple in-memory user model.
type User struct {
	ID           string     `json:"id"`
	Email        string     `json:"email"`
	PasswordHash []byte     `json:"-"`
	TwoFASecret  string     `json:"-"`
	TwoFAEnabled bool       `json:"twoFAEnabled"`
	CreatedAt    time.Time  `json:"createdAt"`
	LastLogin    *time.Time `json:"lastLogin,omitempty"`
}
