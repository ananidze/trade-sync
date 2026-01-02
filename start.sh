#!/bin/bash

# TradeSync Startup Script
# This script starts both the backend and frontend services

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting TradeSync...${NC}"

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "Error: Go is not installed. Please install Go 1.21 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Start backend
echo -e "${GREEN}Starting Go backend on port 8080...${NC}"
cd backend
go run cmd/server/main.go &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

# Check if frontend .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${BLUE}Creating frontend .env.local from example...${NC}"
    cp frontend/.env.example frontend/.env.local
fi

# Start frontend
echo -e "${GREEN}Starting Next.js frontend on port 3000...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${BLUE}TradeSync is running!${NC}"
echo -e "  Frontend: http://localhost:3000"
echo -e "  Backend:  http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Trap Ctrl+C and cleanup
trap "echo -e '\n${BLUE}Stopping TradeSync...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Wait for processes
wait
