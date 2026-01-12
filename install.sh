#!/bin/bash

echo "========================================"
echo "   GigFlow - Installation Script"
echo "========================================"
echo ""

echo "[1/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js: FOUND"
node --version

echo ""
echo "[2/4] Installing Backend Dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "IMPORTANT: Please update MongoDB URI in backend/.env"
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed!"
    exit 1
fi
cd ..

echo ""
echo "[3/4] Installing Frontend Dependencies..."
cd frontend
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed!"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "   Installation Complete! ✓"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Update backend/.env with your MongoDB URI"
echo "   (default: mongodb://localhost:27017/gigflow)"
echo ""
echo "2. Start MongoDB service:"
echo "   - Mac: brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo ""
echo "3. Open TWO terminal windows:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open browser: http://localhost:5173"
echo ""
echo "========================================"
echo "   Happy Coding! 🚀"
echo "========================================"
echo ""
