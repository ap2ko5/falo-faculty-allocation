@echo off
title FALO Server Startup
color 0A
echo.
echo ========================================
echo   FALO Faculty Allocation System
echo   Preparing and Starting Servers...
echo ========================================
echo.
echo [1/6] Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo        Done!
echo.
echo [2/6] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Install from https://nodejs.org/ and re-run this script.
    pause
    exit /b 1
)
echo        Node.js detected.
echo.
echo [3/6] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo npm not found in PATH. Ensure Node.js/npm is installed and try again.
    pause
    exit /b 1
)
echo        npm detected.
echo.
echo [4/6] Installing backend dependencies (if needed)...
if not exist "%~dp0backend\node_modules" (
    echo        Installing backend packages...
    pushd "%~dp0backend"
    npm install || (
        echo Backend npm install failed. Check output above.
        popd
        pause
        exit /b 1
    )
    popd
    echo        Backend packages installed.
) else (
    echo        Backend dependencies already installed.
)
echo.
echo [5/6] Installing frontend dependencies (if needed)...
if not exist "%~dp0frontend\node_modules" (
    echo        Installing frontend packages...
    pushd "%~dp0frontend"
    npm install || (
        echo Frontend npm install failed. Check output above.
        popd
        pause
        exit /b 1
    )
    popd
    echo        Frontend packages installed.
) else (
    echo        Frontend dependencies already installed.
)
echo.
echo [6/6] Starting backend server (port 5051)...
start "FALO Backend" /D "%~dp0backend" cmd /k "echo === BACKEND SERVER === && npm start"
timeout /t 6 /nobreak >nul
echo        Backend window launched.

echo Starting frontend server (port 3000)...
start "FALO Frontend" /D "%~dp0frontend" cmd /k "echo === FRONTEND SERVER === && npm run dev"
timeout /t 3 /nobreak >nul
echo        Frontend window launched.

echo.
echo ========================================
echo   SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo Backend API:  http://localhost:5051/api
echo Frontend UI:  http://localhost:3000
echo.
echo Two command windows are now running. Keep them open while using the app.
echo Press Ctrl+C inside each server window to stop them.
echo.
pause
