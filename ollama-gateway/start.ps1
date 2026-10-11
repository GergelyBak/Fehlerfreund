# Puts the demo chat online: starts the gateway and the ngrok tunnel.
# Ctrl+C stops both. Needs GATEWAY_TOKEN and NGROK_DOMAIN in ollama-gateway/.env
# and a running Ollama.
#
#   powershell -ExecutionPolicy Bypass -File ollama-gateway\start.ps1

$ErrorActionPreference = 'Stop'
$envFile = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path $envFile)) { throw "Missing $envFile (see ollama-gateway/README.md)" }
$domain = (Get-Content $envFile | Where-Object { $_ -match '^NGROK_DOMAIN=' }) -replace '^NGROK_DOMAIN=', ''
if (-not $domain) { throw 'Set NGROK_DOMAIN in ollama-gateway/.env' }

try {
  Invoke-RestMethod http://127.0.0.1:11434/api/version -TimeoutSec 3 | Out-Null
} catch {
  throw 'Ollama is not running. Start the Ollama app first.'
}

# A terminal opened before ngrok was installed doesn't have it on PATH yet.
$ngrok = (Get-Command ngrok -ErrorAction SilentlyContinue).Source
if (-not $ngrok) { $ngrok = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\ngrok.exe' }
if (-not (Test-Path $ngrok)) { throw 'ngrok not found. Install it: winget install --id Ngrok.Ngrok --source winget' }

$gateway = Start-Process node -ArgumentList '--env-file=.env', 'gateway.mjs' -WorkingDirectory $PSScriptRoot -NoNewWindow -PassThru
try {
  Write-Host "Demo chat online at https://$domain (Ctrl+C to stop)"
  & $ngrok http --domain=$domain 11500 --log=stdout --log-level=warn
} finally {
  Stop-Process -Id $gateway.Id -ErrorAction SilentlyContinue
  Write-Host 'Gateway stopped, demo chat is offline.'
}
