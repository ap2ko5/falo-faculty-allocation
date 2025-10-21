# FALO Faculty Allocation - Server Startup Script# FALO Faculty Allocation - Server Startup Script

# ================================================# This script starts both backend and frontend servers



Write-Host "`n=====================================" -ForegroundColor CyanWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host "FALO Server Startup" -ForegroundColor WhiteWrite-Host "FALO Server Startup Script" -ForegroundColor Cyan

Write-Host "=====================================" -ForegroundColor CyanWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host ""

# Kill any existing node processes

Write-Host "`n[1/3] Stopping existing servers..." -ForegroundColor Yellow# Kill any existing node processes

Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinueWrite-Host "Cleaning up existing processes..." -ForegroundColor Yellow

Start-Sleep -Seconds 2Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "      Done!" -ForegroundColor GreenStart-Sleep -Seconds 2

Write-Host "✓ Cleanup complete" -ForegroundColor Green

# Get the script directoryWrite-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Get the script directory

# Start Backend$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[2/3] Starting Backend Server..." -ForegroundColor Yellow

$backendPath = Join-Path $scriptDir "backend"# Start Backend

Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm start"Write-Host "Starting Backend Server..." -ForegroundColor Yellow

Start-Sleep -Seconds 6$backendPath = Join-Path $scriptDir "backend"

Write-Host "      Backend running on port 5051" -ForegroundColor GreenStart-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm start")

Write-Host "✓ Backend starting on http://localhost:5051" -ForegroundColor Green

# Start FrontendWrite-Host ""

Write-Host "`n[3/3] Starting Frontend Server..." -ForegroundColor Yellow

$frontendPath = Join-Path $scriptDir "frontend"# Wait a bit for backend to initialize

Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm run dev"Start-Sleep -Seconds 3

Start-Sleep -Seconds 3

Write-Host "      Frontend running on port 3000" -ForegroundColor Green# Start Frontend

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow

Write-Host "`n=====================================" -ForegroundColor Cyan$frontendPath = Join-Path $scriptDir "frontend"

Write-Host "SERVERS STARTED SUCCESSFULLY!" -ForegroundColor GreenStart-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm run dev")

Write-Host "=====================================" -ForegroundColor CyanWrite-Host "✓ Frontend starting on http://localhost:3000" -ForegroundColor Green

Write-Host "`nBackend:  http://localhost:5051/api" -ForegroundColor WhiteWrite-Host ""

Write-Host "Frontend: http://localhost:3000`n" -ForegroundColor White

Write-Host "=====================================" -ForegroundColor CyanWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host "Servers are starting!" -ForegroundColor Green

Write-Host "`nTwo PowerShell windows are now open." -ForegroundColor GrayWrite-Host "Backend:  http://localhost:5051" -ForegroundColor White

Write-Host "Keep them running while using the app." -ForegroundColor GrayWrite-Host "Frontend: http://localhost:3000" -ForegroundColor White

Write-Host "Press Ctrl+C in each window to stop.`n" -ForegroundColor GrayWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host ""

# Ask to open browserWrite-Host "Press any key to exit this script (servers will keep running)..." -ForegroundColor Yellow

$response = Read-Host "Open browser now? (Y/N)"$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

if ($response -eq "Y" -or $response -eq "y") {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
    Write-Host "`nBrowser opened!" -ForegroundColor Green
}

Write-Host "`nPress Enter to close this window..." -ForegroundColor Yellow
Read-Host
