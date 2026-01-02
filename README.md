# TradeSync

TradeSync is a platform that connects multiple prop firm accounts into a single interface, providing unified analytics, equity tracking, and account oversight.

## Project Structure

```
trade-sync/
├── frontend/          # Next.js frontend application
│   ├── app/           # Next.js app directory
│   │   ├── dashboard/ # Dashboard page
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Home page
│   ├── components/    # React components
│   ├── lib/           # Utility functions and API client
│   └── public/        # Static assets
├── backend/           # Go backend API
│   ├── cmd/
│   │   └── server/    # Main server application
│   └── internal/
│       ├── handlers/  # HTTP handlers
│       └── models/    # Data models
└── README.md
```

## Features

- **Unified Dashboard**: View all your prop firm accounts in one place
- **Real-time Stats**: Monitor total balance, equity, P&L, and more
- **Account Overview**: Detailed table with account information and performance metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Tech Stack**: Built with Next.js 16 and Go with Chi router

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React features

### Backend
- **Go** - High-performance backend language
- **Chi** - Lightweight, idiomatic router
- **CORS** - Cross-origin resource sharing support

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Go 1.21+

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if needed):
   ```bash
   go mod download
   ```

3. Run the server:
   ```bash
   go run cmd/server/main.go
   ```

   The API server will start on `http://localhost:8080`

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Running Both Services

You can run both services simultaneously in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
go run cmd/server/main.go
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /health` - Health check endpoint
- `GET /api/accounts` - Get all prop firm accounts
- `GET /api/trades` - Get all trades
- `GET /api/stats` - Get dashboard statistics

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend

```env
PORT=8080  # Optional, defaults to 8080
```

## Development

### Frontend Development

- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

### Backend Development

- **Build**: `go build -o bin/server cmd/server/main.go`
- **Run**: `./bin/server`
- **Format**: `go fmt ./...`
- **Test**: `go test ./...`

## Mock Data

The backend currently uses mock data for demonstration purposes. The mock data includes:

- 4 prop firm accounts (FTMO, The5ers, MyForexFunds, FundedNext)
- 5 sample trades with various statuses
- Calculated statistics based on the mock accounts and trades

## Future Enhancements

- Real prop firm API integrations
- User authentication and authorization
- Trade journal and notes
- Advanced analytics and charts
- Performance metrics and risk analysis
- Email/SMS notifications for important events
- Export data to CSV/PDF

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

