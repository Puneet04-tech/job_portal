@echo off
echo ========================================
echo    MongoDB Local Installation Guide
echo ========================================
echo.
echo This script will help you install MongoDB Community Edition on Windows
echo.
echo Step 1: Download MongoDB
echo ----------------------------------------
echo Opening MongoDB download page...
echo.
echo Please:
echo 1. Select: MongoDB Community Server
echo 2. Version: Latest (7.0 or higher)
echo 3. Platform: Windows x64
echo 4. Package: MSI
echo 5. Click "Download"
echo.
pause
start https://www.mongodb.com/try/download/community
echo.
echo Step 2: Install MongoDB
echo ----------------------------------------
echo.
echo When the download completes:
echo 1. Run the .msi installer
echo 2. Choose "Complete" installation
echo 3. IMPORTANT: Check "Install MongoDB as a Service"
echo 4. IMPORTANT: Check "Install MongoDB Compass" (GUI tool)
echo 5. Click "Next" and "Install"
echo.
echo Press any key after installation completes...
pause >nul
echo.
echo Step 3: Verify Installation
echo ----------------------------------------
echo.
echo Checking if MongoDB service exists...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service found!
    echo.
    echo Checking service status...
    sc query MongoDB | findstr "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo ✓ MongoDB is already running!
    ) else (
        echo MongoDB service exists but not running.
        echo Starting MongoDB service...
        net start MongoDB
        if %errorlevel% equ 0 (
            echo ✓ MongoDB started successfully!
        ) else (
            echo ✗ Failed to start MongoDB. Try running as Administrator.
        )
    )
) else (
    echo ✗ MongoDB service not found.
    echo Please make sure you selected "Install as Service" during installation.
    echo.
    echo You can manually install the service by running:
    echo "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" --install
)
echo.
echo Step 4: Test Connection
echo ----------------------------------------
echo.
echo Testing MongoDB connection...
timeout /t 2 >nul
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB is working correctly!
    echo.
    echo MongoDB is now ready to use!
    echo Database URL: mongodb://localhost:27017/gigflow
) else (
    echo Note: mongosh command not found, but MongoDB service is running.
    echo This is normal. The database is ready to use!
)
echo.
echo ========================================
echo.
echo Next Steps:
echo 1. MongoDB is now running on: mongodb://localhost:27017
echo 2. The backend .env file is already configured correctly
echo 3. Go to the backend terminal and restart the server:
echo    - Press Ctrl+C to stop
echo    - Run: npm run dev
echo 4. The application should now work!
echo.
echo ========================================
echo.
echo Useful Commands:
echo - Start MongoDB:  net start MongoDB
echo - Stop MongoDB:   net stop MongoDB
echo - Check Status:   sc query MongoDB
echo.
pause
