$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "new-backend"
$admin = Join-Path $root "admin_yourbeep"

$windowsTerminal = Get-Command wt.exe -ErrorAction SilentlyContinue

if ($windowsTerminal) {
  wt.exe `
    -w 0 `
    new-tab --title "gateway" cmd /k "cd /d `"$backend`" && bun run dev:gateway" `; `
    new-tab --title "identity" cmd /k "cd /d `"$backend`" && bun run dev:identity" `; `
    new-tab --title "content" cmd /k "cd /d `"$backend`" && bun run dev:content" `; `
    new-tab --title "commerce" cmd /k "cd /d `"$backend`" && bun run dev:commerce" `; `
    new-tab --title "admin" cmd /k "cd /d `"$admin`" && npm run dev"
  exit 0
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; bun run dev:gateway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; bun run dev:identity"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; bun run dev:content"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; bun run dev:commerce"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$admin'; npm run dev"
