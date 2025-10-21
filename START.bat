@echo off
title FALO Server Startup
color 0A
echo.
echo ========================================
echo   FALO Faculty Allocation System
echo   Preparing and Starting Servers...
echo ========================================
echo.

REM Stop existing node processes
echo [1/3] Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo       Done!
echo.

REM Check for Node and npm
echo [2/6] Checking Node.js and npm availability...
where node >nul 2>&1
if errorlevel 1 (
	echo Node.js not found in PATH. Please install Node.js from https://nodejs.org/ and re-run this script.
	pause
	exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
	echo npm not found in PATH. Ensure Node.js/npm is installed and available in PATH.
	pause
	exit /b 1
)
echo Node and npm detected:
node -v
npm -v
echo.

REM Install dependencies (if needed) and Start Backend Server
echo [3/6] Installing backend dependencies (if needed)...
if not exist "%~dp0backend\node_modules" (
	echo Installing backend dependencies in "%~dp0backend"...
	pushd "%~dp0backend"
	npm install || (
		echo Backend npm install failed. Check the output above.
		popd
		pause
		exit /b 1
	)
	popd
) else (
	echo Backend node_modules found, skipping install.
)
echo.

echo [4/6] Installing frontend dependencies (if needed)...
if not exist "%~dp0frontend\node_modules" (
	echo Installing frontend dependencies in "%~dp0frontend"...
	pushd "%~dp0frontend"
	npm install || (
		echo Frontend npm install failed. Check the output above.
		popd
		pause
		exit /b 1
	)
	popd
) else (
	echo Frontend node_modules found, skipping install.
)
echo.

REM Start Backend Server
echo [5/6] Starting Backend Server (port 5051)...
start "FALO Backend" /D "%~dp0backend" cmd /k "echo === BACKEND SERVER === && npm start"
timeout /t 8 /nobreak >nul
echo       Backend started!
echo.

REM Start Frontend Server
echo [6/6] Starting Frontend Server (port 3000)...
start "FALO Frontend" /D "%~dp0frontend" cmd /k "echo === FRONTEND SERVER === && npm run dev"
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
