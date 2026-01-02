package handlers

import (
	"time"

	"github.com/ananidze/trade-sync/backend/internal/models"
)

// MockDataService provides mock data for the API
type MockDataService struct{}

func NewMockDataService() *MockDataService {
	return &MockDataService{}
}

func (s *MockDataService) GetAccounts() []models.PropFirmAccount {
	now := time.Now()
	return []models.PropFirmAccount{
		{
			ID:            "acc-1",
			FirmName:      "FTMO",
			AccountNumber: "FTMO-123456",
			Balance:       100000.00,
			Equity:        102500.50,
			DailyPnL:      1250.75,
			TotalPnL:      2500.50,
			Drawdown:      500.00,
			MaxDrawdown:   5000.00,
			Status:        "active",
			LastUpdated:   now,
		},
		{
			ID:            "acc-2",
			FirmName:      "The5ers",
			AccountNumber: "T5-789012",
			Balance:       50000.00,
			Equity:        51200.25,
			DailyPnL:      320.50,
			TotalPnL:      1200.25,
			Drawdown:      200.00,
			MaxDrawdown:   2500.00,
			Status:        "active",
			LastUpdated:   now,
		},
		{
			ID:            "acc-3",
			FirmName:      "MyForexFunds",
			AccountNumber: "MFF-345678",
			Balance:       80000.00,
			Equity:        78950.00,
			DailyPnL:      -850.25,
			TotalPnL:      -1050.00,
			Drawdown:      1050.00,
			MaxDrawdown:   4000.00,
			Status:        "active",
			LastUpdated:   now,
		},
		{
			ID:            "acc-4",
			FirmName:      "FundedNext",
			AccountNumber: "FN-901234",
			Balance:       150000.00,
			Equity:        153750.80,
			DailyPnL:      2100.40,
			TotalPnL:      3750.80,
			Drawdown:      300.00,
			MaxDrawdown:   7500.00,
			Status:        "active",
			LastUpdated:   now,
		},
	}
}

func (s *MockDataService) GetTrades() []models.Trade {
	now := time.Now()
	closeTime := now.Add(-2 * time.Hour)
	closePrice1 := 1.0850
	closePrice2 := 145.25
	pnl1 := 250.50
	pnl2 := -120.75

	return []models.Trade{
		{
			ID:        "trade-1",
			AccountID: "acc-1",
			Symbol:    "EURUSD",
			Type:      "buy",
			OpenTime:  now.Add(-4 * time.Hour),
			OpenPrice: 1.0825,
			LotSize:   1.0,
			Status:    "open",
		},
		{
			ID:         "trade-2",
			AccountID:  "acc-1",
			Symbol:     "GBPUSD",
			Type:       "sell",
			OpenTime:   now.Add(-6 * time.Hour),
			CloseTime:  &closeTime,
			OpenPrice:  1.2650,
			ClosePrice: &closePrice1,
			LotSize:    0.5,
			PnL:        &pnl1,
			Status:     "closed",
		},
		{
			ID:        "trade-3",
			AccountID: "acc-2",
			Symbol:    "USDJPY",
			Type:      "buy",
			OpenTime:  now.Add(-3 * time.Hour),
			OpenPrice: 145.50,
			LotSize:   0.75,
			Status:    "open",
		},
		{
			ID:         "trade-4",
			AccountID:  "acc-3",
			Symbol:     "USDJPY",
			Type:       "sell",
			OpenTime:   now.Add(-5 * time.Hour),
			CloseTime:  &closeTime,
			OpenPrice:  145.75,
			ClosePrice: &closePrice2,
			LotSize:    1.0,
			PnL:        &pnl2,
			Status:     "closed",
		},
		{
			ID:        "trade-5",
			AccountID: "acc-4",
			Symbol:    "XAUUSD",
			Type:      "buy",
			OpenTime:  now.Add(-1 * time.Hour),
			OpenPrice: 2050.50,
			LotSize:   2.0,
			Status:    "open",
		},
	}
}

func (s *MockDataService) GetStats() models.DashboardStats {
	accounts := s.GetAccounts()
	trades := s.GetTrades()

	totalBalance := 0.0
	totalEquity := 0.0
	totalPnL := 0.0
	dailyPnL := 0.0
	activeAccounts := 0
	openTrades := 0

	for _, acc := range accounts {
		totalBalance += acc.Balance
		totalEquity += acc.Equity
		totalPnL += acc.TotalPnL
		dailyPnL += acc.DailyPnL
		if acc.Status == "active" {
			activeAccounts++
		}
	}

	for _, trade := range trades {
		if trade.Status == "open" {
			openTrades++
		}
	}

	return models.DashboardStats{
		TotalBalance:   totalBalance,
		TotalEquity:    totalEquity,
		TotalPnL:       totalPnL,
		DailyPnL:       dailyPnL,
		ActiveAccounts: activeAccounts,
		OpenTrades:     openTrades,
	}
}
