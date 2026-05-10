@echo off
REM ===============================================
REM GEMA - Quick Ngrok Deploy Script
REM Run this after ngrok is installed & authenticated
REM ===============================================

setlocal enabledelayedexpansion

REM Colors
color 0A

cls
echo.
echo ╔════════════════════════════════════════════════╗
echo ║     GEMA NGROK QUICK START - Windows          ║
echo ║     Automated Setup & Deploy                  ║
echo ╚════════════════════════════════════════════════╝
echo.

REM ==== CHECK PREREQUISITES ====
echo [1/6] Checking prerequisites...
echo.

REM Check ngrok
where ngrok >nul 2>nul
if errorlevel 1 (
    color 0C
    echo ❌ NGROK NOT FOUND!
    echo.
    echo Please install ngrok:
    echo   1. Download: https://ngrok.com/download
    echo   2. Extract ngrok.exe
    echo   3. Run: ngrok config add-authtoken YOUR_TOKEN
    echo   4. Then run this script again
    echo.
    pause
    exit /b 1
)
echo ✅ Ngrok found

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    color 0C
    echo ❌ NODE.JS NOT FOUND!
    echo Please install from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found
set NODE_VERSION=
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Version: %NODE_VERSION%

color 0A
echo.
echo [2/6] Installing dependencies...
echo.

REM Backend
echo Installing backend packages...
cd backend
if exist node_modules (
    echo    (node_modules exists, skipping)
) else (
    call npm install >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo ❌ Backend npm install failed
        pause
        exit /b 1
    )
)
echo ✅ Backend ready

REM Prisma
echo Generating Prisma client...
call npx prisma generate >nul 2>&1
echo ✅ Prisma generated

REM Frontend
cd ..\frontend
echo Installing frontend packages...
if exist node_modules (
    echo    (node_modules exists, skipping)
) else (
    call npm install >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo ❌ Frontend npm install failed
        pause
        exit /b 1
    )
)
echo ✅ Frontend ready

cd ..

color 0A
echo.
echo [3/6] Environment Configuration
echo.
echo Current .env files found:
if exist backend\.env (
    echo ✅ backend/.env exists
    for /f "tokens=*" %%i in (backend\.env) do echo    %%i
) else (
    echo ⚠️  backend/.env NOT FOUND
)

if exist frontend\.env (
    echo ✅ frontend/.env exists
    for /f "tokens=*" %%i in (frontend\.env) do echo    %%i
) else (
    echo ⚠️  frontend/.env NOT FOUND
)

echo.
echo [4/6] Terminal Setup Instructions
echo.
color 0E
echo OPEN 3 NEW TERMINALS AND RUN:
echo.
echo ┌─────────────────────────────────────────────┐
echo │ TERMINAL 1 (Backend):                       │
echo │ $ cd backend                                │
echo │ $ npm run dev                               │
echo │                                             │
echo │ Expected: "Server is running on port 5002" │
echo └─────────────────────────────────────────────┘
echo.
echo ┌─────────────────────────────────────────────┐
echo │ TERMINAL 2 (Frontend):                      │
echo │ $ cd frontend                               │
echo │ $ npm run dev                               │
echo │                                             │
echo │ Expected: "VITE ... ready in ..."          │
echo │ URL: http://localhost:5173                  │
echo └─────────────────────────────────────────────┘
echo.
echo ┌─────────────────────────────────────────────┐
echo │ TERMINAL 3 (Ngrok):                         │
echo │ $ ngrok http 5002                           │
echo │                                             │
echo │ Expected: Shows URL like                    │
echo │ https://xxxx-xxx-xxx.ngrok-free.app        │
echo └─────────────────────────────────────────────┘
echo.
color 0A
echo [5/6] Next Steps
echo.
echo 1. Open 3 terminals and run commands above
echo 2. Wait for all 3 services to start
echo 3. Copy NGROK URL from Terminal 3
echo 4. Update frontend/.env:
echo    Replace: VITE_API_URL=http://localhost:5002
echo    With:    VITE_API_URL=https://xxxx-xxx-xxx.ngrok-free.app
echo 5. Refresh Terminal 2 (Ctrl+C then npm run dev)
echo.
echo [6/6] Testing URLs
echo.
echo LOCAL ACCESS:
echo   Open: http://localhost:5173
echo.
echo INTERNET ACCESS:
echo   Open: https://xxxx-xxx-xxx.ngrok-free.app
echo.
echo MONITOR REQUESTS:
echo   Open: http://127.0.0.1:4040 (Ngrok Dashboard)
echo.
color 0B
echo ╔════════════════════════════════════════════════╗
echo ║     ✅ SETUP COMPLETE - READY TO DEPLOY!      ║
echo ║                                                ║
echo ║     Open 3 terminals and follow steps above    ║
echo ╚════════════════════════════════════════════════╝
echo.
echo.

pause
