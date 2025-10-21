@echo off
title FALO Server Startup
color 0A
echo.
echo ========================================
echo   FALO Faculty Allocation System
echo   Starting Servers...
echo ========================================
echo.

REM Stop existing node processes
echo [1/3] Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo       Done!
echo.

REM Start Backend Server
echo [2/3] Starting Backend Server (port 5051)...
cd /d "%~dp0backend"
start "FALO Backend" cmd /k "echo === BACKEND SERVER === && npm start"
timeout /t 8 /nobreak >nul
echo       Backend started!
echo.

REM Start Frontend Server
echo [3/3] Starting Frontend Server (port 3000)...
cd /d "%~dp0frontend"
start "FALO Frontend" cmd /k "echo === FRONTEND SERVER === && npm run dev"
timeout /t 3 /nobreak >nul
echo       Frontend started!
echo.

echo ========================================
echo   SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend:  http://localhost:5051/api
echo Frontend: http://localhost:3000
echo.
echo ========================================
echo.
echo Two command windows are now open.
echo Keep them running while using the app!
echo Press Ctrl+C in each window to stop.
echo.
echo Press any key to close this window...
pause >nul
