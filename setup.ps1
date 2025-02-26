function Install-Dependencies {
  Write-Host "Checking and installing dependencies..."
    
  if (-not (Test-Path "./frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..."
    Set-Location ./frontend
    npm install
    Set-Location ..
  }

  Write-Host "Checking Entity Framework CLI tools..."
  $efToolsInstalled = dotnet tool list --global | Select-String "dotnet-ef"
  if (-not $efToolsInstalled) {
    Write-Host "Installing Entity Framework CLI tools..."
    dotnet tool install --global dotnet-ef
  }

  Write-Host "Restoring backend packages..."
  dotnet restore ./backend/Chatbot.Server/Chatbot.Server.csproj
}

function Update-ConnectionString {
  param (
    [string]$connectionString
  )
    
  $appsettingsPath = "./backend/Chatbot.Server/appsettings.json"
  $config = Get-Content $appsettingsPath | ConvertFrom-Json
  $config.ConnectionStrings.MyDatabase = $connectionString
  $config | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath
}

function Test-Database {
  Write-Host "Testing database connection and running migrations..."
  try {
    Set-Location ./backend/Chatbot.Server
    dotnet ef database update
    $success = $?
    Set-Location ../..
    return $success
  }
  catch {
    Set-Location ../..
    return $false
  }
}

function Start-Applications {
  Write-Host "Starting backend application..."
  Start-Process -FilePath "dotnet" -ArgumentList "run --project ./backend/Chatbot.Server --launch-profile http"
    
  Write-Host "Starting frontend application..."
  Start-Process -FilePath "powershell" -ArgumentList "ng serve" -WorkingDirectory "./frontend"
}

Write-Host "Starting project setup..." -ForegroundColor Cyan

Install-Dependencies

$defaultConnection = "Server=localhost;Database=master;Trusted_Connection=True;TrustServerCertificate=True"
$connectionSuccess = $false

while (-not $connectionSuccess) {
  $connectionString = Read-Host -Prompt "Enter database connection string [$defaultConnection]"
    
  if ([string]::IsNullOrWhiteSpace($connectionString)) {
    $connectionString = $defaultConnection
  }
    
  Write-Host "Updating connection string in appsettings.json..."
  Update-ConnectionString $connectionString
    
  if (Test-Database) {
    $connectionSuccess = $true
    Write-Host "Database connection successful!" -ForegroundColor Green
  }
  else {
    Write-Host "Failed to connect to database or update migrations. Please check your connection string." -ForegroundColor Red
  }
}

Start-Applications
Write-Host "Applications started successfully!" -ForegroundColor Green 