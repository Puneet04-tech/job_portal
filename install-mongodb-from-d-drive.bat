@echo off
echo ========================================
echo    MongoDB Installation from D Drive
echo ========================================
echo.
echo Step 1: Run the MongoDB Installer
echo ----------------------------------------
echo.
echo Opening D:\ drive to find your MongoDB installer...
start D:\
echo.
echo Look for a file named something like:
echo   - mongodb-windows-x86_64-7.0.x.msi
echo   - mongodb-windows-x86_64-8.0.x.msi
echo.
echo Double-click the .msi file to start installation
echo.
pause
echo.
echo Step 2: Installation Settings
echo ----------------------------------------
echo.
echo IMPORTANT - During installation:
echo.
echo 1. Choose "Complete" installation type
echo.
echo 2. On "Service Configuration" page:
echo    ✓ CHECK "Install MongoDB as a Service"
echo    - Service Name: MongoDB
echo    - Data Directory: C:\Program Files\MongoDB\Server\7.0\data
echo    - Log Directory: C:\Program Files\MongoDB\Server\7.0\log
echo.
echo 3. ✓ CHECK "Install MongoDB Compass" (optional GUI tool)
echo.
echo 4. Click "Next" then "Install"
echo.
echo 5. Wait for installation to complete (may take 2-5 minutes)
echo.
echo Press any key AFTER installation completes...
pause >nul
echo.
echo Step 3: Starting MongoDB Service
echo ----------------------------------------
echo.
echo Checking if MongoDB service is installed...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service found!
    echo.
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% equ 0 (
        echo.
        echo ✓✓✓ SUCCESS! MongoDB is now running! ✓✓✓
        echo.
    ) else (
        echo.
        echo Service exists but failed to start.
        echo This might be because it's already running.
        echo.
        sc query MongoDB | findstr "STATE"
    )
) else (
    echo.
    echo ✗ MongoDB service not found.
    echo.
    echo This means either:
    echo 1. Installation not complete yet
    echo 2. You didn't check "Install as Service" during installation
    echo.
    echo Please re-run the installer and make sure to check:
    echo "Install MongoDB as a Service"
    echo.
)
echo.
echo Step 4: Verify MongoDB is Working
echo ----------------------------------------
echo.
echo Checking MongoDB connection...
timeout /t 2 >nul
echo.
sc query MongoDB | findstr "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✓✓✓ MongoDB is RUNNING successfully! ✓✓✓
    echo.
    echo Connection URL: mongodb://localhost:27017
    echo Database Name: gigflow
    echo.
    echo ========================================
    echo    INSTALLATION COMPLETE!
    echo ========================================
    echo.
    echo Next Steps:
    echo.
    echo 1. Go to your BACKEND terminal
    echo.
    echo 2. Stop the server (Press Ctrl+C)
    echo.
    echo 3. Start it again:
    echo    npm run dev
    echo.
    echo 4. You should see: "MongoDB Connected: localhost"
    echo.
    echo 5. Go to your browser: http://localhost:5173
    echo.
    echo 6. Create an account and test the app!
    echo.
) else (
    echo ✗ MongoDB is not running
    echo.
    echo Please make sure the installation completed successfully
    echo and that you selected "Install as Service"
    echo.
)
echo.
echo ========================================
echo.
echo Useful MongoDB Commands:
echo.
echo Start MongoDB:    net start MongoDB
echo Stop MongoDB:     net stop MongoDB
echo Check Status:     sc query MongoDB
echo.
echo ========================================
echo.
pause
