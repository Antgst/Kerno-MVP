param(
  [string]$WslProjectPath = "/home/antgo/projects/Kerno-MVP",
  [string]$OutputDirectory = "$env:USERPROFILE\Videos\KERNO\Kerno-Demo-V3",
  [switch]$Headed
)

$ErrorActionPreference = "Stop"

Write-Host "`nKERNO Demo Video V3" -ForegroundColor DarkGreen
Write-Host "Project in WSL: $WslProjectPath"
Write-Host "Windows output: $OutputDirectory`n"

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$WslOutputDirectory = (& wsl.exe wslpath -a "$OutputDirectory").Trim()
if (-not $WslOutputDirectory) {
  throw "Unable to convert the Windows output directory to a WSL path."
}

$HeadedEnvironment = if ($Headed) { "KERNO_VIDEO_HEADED=1 " } else { "" }
$Command = @"
cd '$WslProjectPath' && \
KERNO_VIDEO_EXPORT_DIR='$WslOutputDirectory' \
${HeadedEnvironment}bash scripts/demoday-video/run-video.sh
"@

Write-Host "The capture runs locally through WSL. VS Code is not used." -ForegroundColor DarkGray
if ($Headed) {
  Write-Host "Chromium will be visible during capture." -ForegroundColor DarkGray
} else {
  Write-Host "Chromium runs headlessly for a cleaner and more stable recording." -ForegroundColor DarkGray
}

& wsl.exe bash -lc $Command
if ($LASTEXITCODE -ne 0) {
  throw "KERNO video capture failed. Check scripts/demoday-video/.runtime/kerno-dev.log in WSL."
}

Write-Host "`nCapture completed." -ForegroundColor Green
Write-Host "Open this folder and import the clips into Clipchamp:"
Write-Host $OutputDirectory -ForegroundColor Cyan
