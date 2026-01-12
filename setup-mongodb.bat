@echo off
echo ========================================
echo    MongoDB Atlas Setup Helper
echo ========================================
echo.
echo Follow these steps to get your FREE MongoDB database:
echo.
echo 1. Open this URL in your browser:
echo    https://www.mongodb.com/cloud/atlas/register
echo.
echo 2. Create a FREE account (select M0 FREE tier)
echo.
echo 3. Create Database User:
echo    Username: gigflow_admin
echo    Password: [Generate secure password - SAVE IT!]
echo.
echo 4. Network Access:
echo    Add IP: 0.0.0.0/0 (Allow from anywhere)
echo.
echo 5. Get Connection String:
echo    - Click "Connect" button
echo    - Choose "Connect your application"
echo    - Copy the connection string
echo.
echo 6. Your connection string will look like:
echo    mongodb+srv://gigflow_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gigflow
echo.
echo 7. After getting your connection string:
echo    - Open: backend\.env
echo    - Replace the MONGODB_URI line with your connection string
echo    - Save the file
echo.
echo 8. Restart the backend server:
echo    - Go to backend terminal
echo    - Press Ctrl+C to stop
echo    - Run: npm run dev
echo.
echo ========================================
echo.
echo Press any key to open MongoDB Atlas in browser...
pause >nul
start https://www.mongodb.com/cloud/atlas/register
echo.
echo After setup, edit backend\.env and restart the server!
echo.
pause
