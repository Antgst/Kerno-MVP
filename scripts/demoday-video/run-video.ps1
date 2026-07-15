param(
  [string]$DistroName = "Ubuntu-20.04",
  [string]$WslProjectPath = "/home/antgo/projects/Kerno-MVP",
  [string]$OutputDirectory = "$env:USERPROFILE\Videos\KERNO\Kerno-Demo-V3",
  [switch]$Headed
)

$ErrorActionPreference = "Stop"

Write-Host "`nKERNO Demo Video V3" -ForegroundColor DarkGreen
Write-Host "WSL distribution: $DistroName"
Write-Host "Project in WSL: $WslProjectPath"
Write-Host "Windows output: $OutputDirectory`n"

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$ResolvedOutputDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
if ($ResolvedOutputDirectory -notmatch '^([A-Za-z]):\\(.*)$') {
  throw "The output directory must be located on a Windows drive, for example C:\Users\antgo\Videos\KERNO."
}

$DriveLetter = $Matches[1].ToLowerInvariant()
$RelativePath = $Matches[2] -replace '\\', '/'
$WslOutputDirectory = "/mnt/$DriveLetter/$RelativePath"

$EnvironmentAssignments = @("KERNO_VIDEO_EXPORT_DIR='$WslOutputDirectory'")
if ($Headed) {
  $EnvironmentAssignments += "KERNO_VIDEO_HEADED=1"
}

$EnvironmentPrefix = $EnvironmentAssignments -join " "
$Command = "cd '$WslProjectPath' && $EnvironmentPrefix bash scripts/demoday-video/run-video.sh"

Write-Host "The capture runs locally through WSL. VS Code is not used." -ForegroundColor DarkGray
if ($Headed) {
  Write-Host "Chromium will be visible during capture." -ForegroundColor DarkGray
} else {
  Write-Host "Chromium runs headlessly for a cleaner and more stable recording." -ForegroundColor DarkGray
}

& wsl.exe -d $DistroName bash -lc $Command
if ($LASTEXITCODE -ne 0) {
  throw "KERNO video capture failed. Check scripts/demoday-video/.runtime/kerno-dev.log in WSL."
}

Write-Host "`nCapture completed." -ForegroundColor Green
Write-Host "Open this folder and import the clips into Clipchamp:"
Write-Host $ResolvedOutputDirectory -ForegroundColor Cyan
