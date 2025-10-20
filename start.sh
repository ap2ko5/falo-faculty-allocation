#!/bin/bash

# FALO Quick Start Script
# This script helps you quickly start both frontend and backend servers

set -e

echo "=================================="
echo "FALO - Faculty Allocation System"
echo "Quick Start Script"
echo "=================================="
echo ""

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your Supabase credentials"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    echo "VITE_API_URL=http://localhost:5051/api" > frontend/.env
fi

echo "✅ Setup complete!"
echo ""
echo "Starting servers..."
echo "=================================="
echo ""

# Start backend in background
echo "🚀 Starting backend server on port 5051..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5051/health > /dev/null 2>&1; then
    echo "✅ Backend is running (PID: $BACKEND_PID)"
else
    echo "⚠️  Backend may not be ready yet, check backend.log"
fi

echo ""
echo "🚀 Starting frontend server on port 3000..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo ""
echo "=================================="
echo "✅ Servers are starting!"
echo "=================================="
echo ""
echo "📡 Backend:  http://localhost:5051"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "View logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "=================================="
echo "Happy coding! 🎉"
echo "=================================="
