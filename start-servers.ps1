param()

# FALO Faculty Allocation - PowerShell startup helper
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "FALO Server Startup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/6] Stopping existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "    Done" -ForegroundColor Green
Write-Host ""

Write-Host "[2/6] Checking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion  = npm --version
    Write-Host "    Node.js $nodeVersion" -ForegroundColor Green
    Write-Host "    npm     $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js or npm not found. Install from https://nodejs.org/ and re-run this script." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}
Write-Host ""

$root        = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir  = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'
$backendEnv  = Join-Path $backendDir '.env'
$backendEnvExample  = Join-Path $backendDir '.env.example'
$frontendEnv = Join-Path $frontendDir '.env'
$frontendEnvExample = Join-Path $frontendDir '.env.example'
$envNotices = @()

function Ensure-EnvFile {
    param(
        [string]$Target,
        [string]$Example,
        [string]$Label,
        [switch]$RequiresUpdate
    )

    if (Test-Path $Target) {
        Write-Host "    $Label ready." -ForegroundColor Green
        return
    }

    if (-not (Test-Path $Example)) {
        Write-Host "    Missing $Label and no example file found." -ForegroundColor Red
        throw "Missing $Label"
    }

    Write-Host "    $Label missing. Creating from template..." -ForegroundColor Yellow
    Copy-Item -Path $Example -Destination $Target -Force
    Write-Host "    Created $Label." -ForegroundColor Green

    if ($RequiresUpdate) {
        $script:envNotices += $Label
    }
}

function Install-IfMissing {
    param(
        [string]$Path,
        [string]$Label
    )

    $nodeModules = Join-Path $Path 'node_modules'
    if (-not (Test-Path $nodeModules)) {
        Write-Host "Installing $Label dependencies..." -ForegroundColor Yellow
        Push-Location $Path
        npm install
        $exit = $LASTEXITCODE
        Pop-Location
        if ($exit -ne 0) {
            Write-Host "$Label npm install failed. Check the output above." -ForegroundColor Red
            Read-Host "Press Enter to close"
            exit 1
        }
        Write-Host "    Installed" -ForegroundColor Green
    } else {
        Write-Host "$Label dependencies already present." -ForegroundColor Green
    }
}

Write-Host "[3/6] Preparing environment files..." -ForegroundColor Yellow
try {
    Ensure-EnvFile -Target $backendEnv -Example $backendEnvExample -Label 'backend/.env' -RequiresUpdate
    Ensure-EnvFile -Target $frontendEnv -Example $frontendEnvExample -Label 'frontend/.env'
} catch {
    Write-Host $_ -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}
Write-Host "" 

Write-Host "[4/6] Ensuring dependencies..." -ForegroundColor Yellow
Install-IfMissing -Path $backendDir  -Label 'Backend'
Install-IfMissing -Path $frontendDir -Label 'Frontend'
Write-Host ""

Write-Host "[5/6] Starting backend (port 5051)..." -ForegroundColor Yellow
$backend = Start-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location '$backendDir'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; npm start") -PassThru
Start-Sleep -Seconds 6
Write-Host "    Backend window launched" -ForegroundColor Green

Write-Host "[6/6] Starting frontend (port 3000)..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath powershell -ArgumentList @('-NoExit','-Command',"Set-Location '$frontendDir'; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Cyan; npm run dev") -PassThru
Start-Sleep -Seconds 3
Write-Host "    Frontend window launched" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5051/api" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
if ($envNotices.Count -gt 0) {
    Write-Host "IMPORTANT: backend/.env was created from the example file. Update it with your Supabase credentials before using the app." -ForegroundColor Yellow
}
Write-Host "Two PowerShell windows are now running. Keep them open while using the app." -ForegroundColor Gray
Write-Host "Press Ctrl+C in each server window to stop them." -ForegroundColor Gray
Write-Host ""
$choice = Read-Host "Open the frontend in your browser now? (Y/N)"
if ($choice -match '^[Yy]$') {
    Start-Process 'http://localhost:3000'
}
Write-Host "Press Enter to close this helper window (servers stay running)..." -ForegroundColor Yellow
Read-Host > $null
