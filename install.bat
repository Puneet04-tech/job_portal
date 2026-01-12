@echo off
echo ========================================
echo    GigFlow - Installation Script
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: FOUND
node --version

echo.
echo [2/4] Installing Backend Dependencies...
cd backend
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
    echo IMPORTANT: Please update MongoDB URI in backend\.env
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Installing Frontend Dependencies...
cd frontend
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Installation Complete! ✓
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Update backend\.env with your MongoDB URI
echo    (default: mongodb://localhost:27017/gigflow)
echo.
echo 2. Start MongoDB service:
echo    - Windows: net start MongoDB
echo    - Mac: brew services start mongodb-community
echo    - Linux: sudo systemctl start mongod
echo.
echo 3. Open TWO terminal windows:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open browser: http://localhost:5173
echo.
echo ========================================
echo    Happy Coding! 🚀
echo ========================================
echo.
pause
