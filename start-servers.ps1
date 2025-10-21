# FALO Faculty Allocation - Server Startup Script# FALO Faculty Allocation - Server Startup Script

# This script starts both backend and frontend servers# This script starts both backend and frontend servers



Write-Host "`n=====================================" -ForegroundColor CyanWrite-Host "`n=====================================" -ForegroundColor Cyan

Write-Host "FALO Server Startup Script" -ForegroundColor CyanWrite-Host "FALO Server Startup Script" -ForegroundColor Cyan

Write-Host "=====================================" -ForegroundColor CyanWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host ""Write-Host ""



# Kill any existing node processes# Kill any existing node processes

Write-Host "Cleaning up existing processes..." -ForegroundColor YellowWrite-Host "Cleaning up existing processes..." -ForegroundColor Yellow

Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -ForceGet-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep -Seconds 2Start-Sleep -Seconds 2

Write-Host "✓ Cleanup complete" -ForegroundColor GreenWrite-Host "✓ Cleanup complete" -ForegroundColor Green

Write-Host ""

# Get the script directoryWrite-Host ""

# Get the script directory

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path



# Check for Node.js and npm# Get the script directory

Write-Host "Checking Node.js and npm..." -ForegroundColor Yellow

try {# Start Backend$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

    $nodeVersion = node --version

    $npmVersion = npm --versionWrite-Host "`n[2/3] Starting Backend Server..." -ForegroundColor Yellow

    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green

    Write-Host "✓ npm $npmVersion detected" -ForegroundColor Green$backendPath = Join-Path $scriptDir "backend"# Start Backend

} catch {

    Write-Host "✗ Node.js or npm not found. Please install Node.js from https://nodejs.org/" -ForegroundColor RedStart-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm start"Write-Host "Starting Backend Server..." -ForegroundColor Yellow

    Read-Host "Press Enter to exit"

    exit 1Start-Sleep -Seconds 6$backendPath = Join-Path $scriptDir "backend"

}

Write-Host ""Write-Host "      Backend running on port 5051" -ForegroundColor GreenStart-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm start")



# Install dependencies if neededWrite-Host "✓ Backend starting on http://localhost:5051" -ForegroundColor Green

$backendPath = Join-Path $scriptDir "backend"

$frontendPath = Join-Path $scriptDir "frontend"# Start FrontendWrite-Host ""



if (-Not (Test-Path (Join-Path $backendPath "node_modules"))) {Write-Host "`n[3/3] Starting Frontend Server..." -ForegroundColor Yellow

    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow

    Push-Location $backendPath$frontendPath = Join-Path $scriptDir "frontend"# Wait a bit for backend to initialize

    npm install

    if ($LASTEXITCODE -ne 0) {Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","Set-Location '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm run dev"Start-Sleep -Seconds 3

        Write-Host "✗ Backend npm install failed" -ForegroundColor Red

        Pop-LocationStart-Sleep -Seconds 3

        Read-Host "Press Enter to exit"

        exit 1Write-Host "      Frontend running on port 3000" -ForegroundColor Green# Start Frontend

    }

    Pop-LocationWrite-Host "Starting Frontend Server..." -ForegroundColor Yellow

    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

} else {Write-Host "`n=====================================" -ForegroundColor Cyan$frontendPath = Join-Path $scriptDir "frontend"

    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green

}Write-Host "SERVERS STARTED SUCCESSFULLY!" -ForegroundColor GreenStart-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm run dev")



if (-Not (Test-Path (Join-Path $frontendPath "node_modules"))) {Write-Host "=====================================" -ForegroundColor CyanWrite-Host "✓ Frontend starting on http://localhost:3000" -ForegroundColor Green

    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow

    Push-Location $frontendPathWrite-Host "`nBackend:  http://localhost:5051/api" -ForegroundColor WhiteWrite-Host ""

    npm install

    if ($LASTEXITCODE -ne 0) {Write-Host "Frontend: http://localhost:3000`n" -ForegroundColor White

        Write-Host "✗ Frontend npm install failed" -ForegroundColor Red

        Pop-LocationWrite-Host "=====================================" -ForegroundColor CyanWrite-Host "=====================================" -ForegroundColor Cyan

        Read-Host "Press Enter to exit"

        exit 1Write-Host "Servers are starting!" -ForegroundColor Green

    }

    Pop-LocationWrite-Host "`nTwo PowerShell windows are now open." -ForegroundColor GrayWrite-Host "Backend:  http://localhost:5051" -ForegroundColor White

    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

} else {Write-Host "Keep them running while using the app." -ForegroundColor GrayWrite-Host "Frontend: http://localhost:3000" -ForegroundColor White

    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green

}Write-Host "Press Ctrl+C in each window to stop.`n" -ForegroundColor GrayWrite-Host "=====================================" -ForegroundColor Cyan

Write-Host ""

Write-Host ""

# Start Backend

Write-Host "Starting Backend Server..." -ForegroundColor Yellow# Ask to open browserWrite-Host "Press any key to exit this script (servers will keep running)..." -ForegroundColor Yellow

Start-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm start")

Write-Host "✓ Backend starting on http://localhost:5051" -ForegroundColor Green$response = Read-Host "Open browser now? (Y/N)"$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

Write-Host ""

if ($response -eq "Y" -or $response -eq "y") {

# Wait a bit for backend to initialize    Start-Sleep -Seconds 2

Start-Sleep -Seconds 3    Start-Process "http://localhost:3000"

    Write-Host "`nBrowser opened!" -ForegroundColor Green

# Start Frontend}

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow

Start-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location -Path '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm run dev")Write-Host "`nPress Enter to close this window..." -ForegroundColor Yellow

Write-Host "✓ Frontend starting on http://localhost:3000" -ForegroundColor GreenRead-Host

Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5051" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two PowerShell windows are now open." -ForegroundColor Gray
Write-Host "Keep them running while using the app." -ForegroundColor Gray
Write-Host "Press Ctrl+C in each window to stop." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this script (servers will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
