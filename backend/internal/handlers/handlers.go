package handlers

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	mockData *MockDataService
}

func NewHandler() *Handler {
	return &Handler{
		mockData: NewMockDataService(),
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
