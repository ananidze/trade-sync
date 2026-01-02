package models

import "time"

type PropFirmAccount struct {
	ID            string    `json:"id"`
	FirmName      string    `json:"firmName"`
	AccountNumber string    `json:"accountNumber"`
	Balance       float64   `json:"balance"`
	Equity        float64   `json:"equity"`
	DailyPnL      float64   `json:"dailyPnL"`
	TotalPnL      float64   `json:"totalPnL"`
	Drawdown      float64   `json:"drawdown"`
	MaxDrawdown   float64   `json:"maxDrawdown"`
	Status        string    `json:"status"`
	LastUpdated   time.Time `json:"lastUpdated"`
}

type Trade struct {
	ID         string     `json:"id"`
	AccountID  string     `json:"accountId"`
	Symbol     string     `json:"symbol"`
	Type       string     `json:"type"`
	OpenTime   time.Time  `json:"openTime"`
	CloseTime  *time.Time `json:"closeTime,omitempty"`
	OpenPrice  float64    `json:"openPrice"`
	ClosePrice *float64   `json:"closePrice,omitempty"`
	LotSize    float64    `json:"lotSize"`
	PnL        *float64   `json:"pnl,omitempty"`
	Status     string     `json:"status"`
}

type DashboardStats struct {
	TotalBalance   float64 `json:"totalBalance"`
	TotalEquity    float64 `json:"totalEquity"`
	TotalPnL       float64 `json:"totalPnL"`
	DailyPnL       float64 `json:"dailyPnL"`
	ActiveAccounts int     `json:"activeAccounts"`
	OpenTrades     int     `json:"openTrades"`
}
