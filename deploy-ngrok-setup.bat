@echo off
REM Deploy dengan Ngrok - Windows Batch Script
REM Save file ini sebagai deploy-ngrok.bat di folder project root

echo.
echo ========================================
echo     GEMA APPLICATION - NGROK DEPLOY
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ NGROK NOT FOUND!
    echo.
    echo Please install ngrok first:
    echo   1. Download: https://ngrok.com/download
    echo   2. Extract and add to PATH
    echo   3. Run: ngrok config add-authtoken YOUR_TOKEN
    echo.
    pause
    exit /b 1
)

echo ✅ Ngrok found!
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ NODE.JS NOT FOUND!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found!
echo.

REM Navigate to backend
cd backend
echo.
echo [1/4] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend install failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo [2/4] Generating Prisma client...
call npx prisma generate
echo ✅ Prisma generated

cd ..

REM Navigate to frontend
cd frontend
echo.
echo [3/4] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend install failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..

echo.
echo ========================================
echo     SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Open Terminal 1: cd backend && npm run dev
echo 2. Open Terminal 2: cd frontend && npm run dev
echo 3. Open Terminal 3: ngrok http 5000
echo 4. Update frontend API URL to ngrok URL
echo 5. Open http://localhost:5173 to test
echo.
echo Happy Coding! 🎉
echo.
pause
