# Bezejmeny Dual-Domain Deployment Script
# This script prepares files for both GitHub Pages (.xyz) and PHP hosting (.online)

param(
    [string]$Target = "both"  # Options: "github", "online", "both"
)

Write-Host "=== Bezejmeny Deployment Script ===" -ForegroundColor Cyan

# Create deployment directories
$githubDir = "deploy-github"
$onlineDir = "deploy-online"

if (Test-Path $githubDir) { Remove-Item $githubDir -Recurse -Force }
if (Test-Path $onlineDir) { Remove-Item $onlineDir -Recurse -Force }

New-Item -ItemType Directory $githubDir, $onlineDir | Out-Null

if ($Target -eq "github" -or $Target -eq "both") {
    Write-Host "📦 Preparing GitHub Pages deployment..." -ForegroundColor Green
    
    # Copy all files for GitHub
    Copy-Item -Path "*" -Destination $githubDir -Recurse -Exclude @("deploy-*", ".git")
    
    # Ensure correct .htaccess for GitHub
    Copy-Item ".htaccess" "$githubDir\.htaccess" -Force
    
    # Remove online-specific files
    Remove-Item "$githubDir\.htaccess-for-online" -ErrorAction SilentlyContinue
    Remove-Item "$githubDir\deploy.ps1" -ErrorAction SilentlyContinue
    
    Write-Host "✅ GitHub deployment ready in: $githubDir" -ForegroundColor Green
    Write-Host "   - Contains: Static files + Jekyll config + GitHub .htaccess"
    Write-Host "   - Jekyll will exclude PHP files automatically"
}

if ($Target -eq "online" -or $Target -eq "both") {
    Write-Host "📦 Preparing PHP hosting deployment..." -ForegroundColor Yellow
    
    # Copy PHP files and directories
    $phpDirs = @("admin", "api", "register", "founders", "includes", "cache", "logs")
    foreach ($dir in $phpDirs) {
        if (Test-Path $dir) {
            Copy-Item -Path $dir -Destination $onlineDir -Recurse
        }
    }
    
    # Copy essential files for PHP hosting
    Copy-Item "404.html" "$onlineDir\404.html" -ErrorAction SilentlyContinue
    
    # Copy and rename .htaccess for online hosting  
    Copy-Item ".htaccess-for-online" "$onlineDir\.htaccess"
    
    # Create simple index.php that redirects to .xyz
    @"
<?php
// Redirect root access to .xyz domain
header('Location: https://bezejmeny.xyz/', true, 301);
exit();
?>
"@ | Out-File "$onlineDir\index.php" -Encoding UTF8
    
    Write-Host "✅ PHP hosting deployment ready in: $onlineDir" -ForegroundColor Yellow
    Write-Host "   - Contains: PHP files + correct .htaccess + redirect index.php"
    Write-Host "   - No static HTML files (redirects to .xyz)"
}

Write-Host "`n🚀 Deployment Summary:" -ForegroundColor Cyan
if ($Target -eq "github" -or $Target -eq "both") {
    Write-Host "📁 Upload $githubDir contents to GitHub Pages" -ForegroundColor Green
}
if ($Target -eq "online" -or $Target -eq "both") {
    Write-Host "📁 Upload $onlineDir contents to bezejmeny.online hosting" -ForegroundColor Yellow
}
Write-Host "`n✨ Both domains will work with proper routing!" -ForegroundColor Magenta