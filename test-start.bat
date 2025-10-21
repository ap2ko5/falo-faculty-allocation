@echo off
echo Testing START.bat execution...
echo Current directory: %CD%
echo Script directory: %~dp0
echo.
echo Step 1: Node check
where node
echo.
echo Step 2: Backend .env check
if exist "%~dp0backend\.env" (
    echo Backend .env EXISTS
) else (
    echo Backend .env MISSING
)
echo.
echo Step 3: Frontend .env check
if exist "%~dp0frontend\.env" (
    echo Frontend .env EXISTS  
) else (
    echo Frontend .env MISSING
)
echo.
echo Step 4: Backend node_modules check
if exist "%~dp0backend\node_modules" (
    echo Backend node_modules EXISTS
) else (
    echo Backend node_modules MISSING
)
echo.
pause
