@echo off
setlocal ENABLEDELAYEDEXPANSION
title FALO Server Startup
color 0A

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_ENV=%BACKEND_DIR%\.env"
set "BACKEND_ENV_EXAMPLE=%BACKEND_DIR%\.env.example"
set "FRONTEND_ENV=%FRONTEND_DIR%\.env"
set "FRONTEND_ENV_EXAMPLE=%FRONTEND_DIR%\.env.example"
set "BACKEND_ENV_CREATED=0"
set "FRONTEND_ENV_CREATED=0"

echo.
echo ========================================
echo   FALO Faculty Allocation System
echo   Preparing and Starting Servers...
echo ========================================
echo.

echo [1/7] Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo        Done!
echo.

echo [2/7] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Install from https://nodejs.org/ and re-run this script.
    goto :error
)
echo        Node.js detected.
echo.

echo [3/7] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo npm not found in PATH. Ensure Node.js/npm is installed and try again.
    goto :error
)
echo        npm detected.
echo.

echo [4/7] Preparing environment files...
if not exist "%BACKEND_ENV%" (
    if exist "%BACKEND_ENV_EXAMPLE%" (
        echo        backend\.env missing. Creating from backend\.env.example...
        copy /Y "%BACKEND_ENV_EXAMPLE%" "%BACKEND_ENV%" >nul
        if errorlevel 1 (
            echo        Failed to create backend\.env. Check file permissions.
            goto :error
        )
        set "BACKEND_ENV_CREATED=1"
        echo        Created backend\.env. Update Supabase credentials before using the app.
    ) else (
        echo        backend\.env is missing and no template was found.
        echo        Copy backend\.env.example to backend\.env and fill in your credentials.
        goto :error
    )
) else (
    echo        backend\.env ready.
)

if not exist "%FRONTEND_ENV%" (
    if exist "%FRONTEND_ENV_EXAMPLE%" (
        echo        frontend\.env missing. Creating from frontend\.env.example...
        copy /Y "%FRONTEND_ENV_EXAMPLE%" "%FRONTEND_ENV%" >nul
        if errorlevel 1 (
            echo        Failed to create frontend\.env. Check file permissions.
            goto :error
        )
        set "FRONTEND_ENV_CREATED=1"
        echo        Created frontend\.env.
    ) else (
        echo        frontend\.env is missing and no template was found.
        goto :error
    )
) else (
    echo        frontend\.env ready.
)
echo.

echo [5/7] Installing backend dependencies (if needed)...
if not exist "%BACKEND_DIR%\node_modules" (
    echo        Installing backend packages...
    pushd "%BACKEND_DIR%"
    npm install || (
        echo Backend npm install failed. Check output above.
        popd
        goto :error
    )
    popd
    echo        Backend packages installed.
) else (
    echo        Backend dependencies already installed.
)
echo.

echo [6/7] Installing frontend dependencies (if needed)...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo        Installing frontend packages...
    pushd "%FRONTEND_DIR%"
    npm install || (
        echo Frontend npm install failed. Check output above.
        popd
        goto :error
    )
    popd
    echo        Frontend packages installed.
) else (
    echo        Frontend dependencies already installed.
)
echo.

echo [7/7] Launching servers...
start "FALO Backend" /D "%BACKEND_DIR%" cmd /k "echo === BACKEND SERVER === && npm start"
timeout /t 6 /nobreak >nul
echo        Backend window launched.

start "FALO Frontend" /D "%FRONTEND_DIR%" cmd /k "echo === FRONTEND SERVER === && npm run dev"
timeout /t 3 /nobreak >nul
echo        Frontend window launched.

echo.
echo ========================================
echo   SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo Backend API:  http://localhost:5051/api
echo Frontend UI:  http://localhost:3000
echo.
if "%BACKEND_ENV_CREATED%"=="1" (
    echo IMPORTANT: backend\.env was created from the example file.
    echo Update it with your Supabase URL, service role key, anon key, and JWT secret before using the app.
    echo.
)
echo Two command windows are now running. Keep them open while using the app.
echo Press Ctrl+C inside each server window to stop them.
echo.
goto :end

:error
echo.
echo Startup aborted. Resolve the issue above and run START.bat again.
echo.
pause
endlocal
exit /b 1

:end
pause
endlocal
exit /b 0
