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
│   │   ├── auth.go
│   │   ├── handlers.go
│   │   └── mock_data.go
│   └── models/          # Data models
│       ├── models.go
│       └── user.go
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

### Authentication & 2FA
- **POST** `/api/register` - Register with email and password
- **POST** `/api/login` - Login and receive JWT or a pending token when 2FA is enabled
- **POST** `/api/2fa/enable` - (Protected) Generate a TOTP secret and QR code for the user
- **POST** `/api/2fa/verify` - Verify a TOTP code to activate or satisfy 2FA

### Protected Resources (JWT + 2FA)
- **GET** `/api/accounts`
- **GET** `/api/trades`
- **GET** `/api/stats`

## Mock Data

The application currently uses mock data defined in `internal/handlers/mock_data.go`. This includes:

- 4 prop firm accounts (FTMO, The5ers, MyForexFunds, FundedNext)
- 5 sample trades
- Calculated statistics

## Environment Variables

Copy `.env.example` to `.env` and update as needed.

- `PORT` - Server port (default: 8080)
- `JWT_SECRET` - Secret key used to sign JWT tokens
- `TOTP_ISSUER` - Issuer label shown in authenticator apps (default: TradeSync)
- `JWT_TTL_HOURS` - Access token lifetime in hours (default: 24)

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
