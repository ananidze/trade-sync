# TradeSync Backend

Go backend API for TradeSync trading dashboard.

## Tech Stack

- **Go 1.21+**
- **Chi Router** - Lightweight HTTP router
- **Chi CORS** - CORS middleware

## Project Structure

```
backend/
├── cmd/
│   └── server/          # Main application entry point
│       └── main.go
├── internal/
│   ├── handlers/        # HTTP request handlers
│   │   ├── handlers.go
│   │   └── mock_data.go
│   └── models/          # Data models
│       └── models.go
├── go.mod
└── go.sum
```

## Getting Started

### Prerequisites

- Go 1.21 or higher

### Installation

1. Install dependencies:
   ```bash
   go mod download
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

### Running the Server

```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

### Building

```bash
go build -o bin/server cmd/server/main.go
./bin/server
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Accounts
- **GET** `/api/accounts`
- Returns all prop firm accounts with balances, equity, P&L, etc.

### Trades
- **GET** `/api/trades`
- Returns all trades (open and closed)

### Statistics
- **GET** `/api/stats`
- Returns aggregated dashboard statistics

## Mock Data

The application currently uses mock data defined in `internal/handlers/mock_data.go`. This includes:

- 4 prop firm accounts (FTMO, The5ers, MyForexFunds, FundedNext)
- 5 sample trades
- Calculated statistics

## Environment Variables

- `PORT` - Server port (default: 8080)

## Development

### Format Code
```bash
go fmt ./...
```

### Run Tests
```bash
go test ./...
```

### Install Dependencies
```bash
go get github.com/go-chi/chi/v5
go get github.com/go-chi/cors
```
