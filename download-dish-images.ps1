# Create the directory if it doesn't exist
$imageDir = ".\public\images\dishes"
if (-not (Test-Path $imageDir)) {
    New-Item -ItemType Directory -Path $imageDir -Force
}

try {
    # Download Masala Dosa image
    $masalaDosaUrl = "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/masala-dosa-recipe.jpg"
    $masalaDosaPath = Join-Path $imageDir "masala-dosa-new.jpg"
    
    Write-Host "Downloading Masala Dosa image..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $masalaDosaUrl -OutFile $masalaDosaPath -UseBasicParsing
    
    if (Test-Path $masalaDosaPath) {
        Write-Host "Successfully downloaded Masala Dosa image to $masalaDosaPath"
    } else {
        Write-Host "Failed to download image"
    }
} catch {
    Write-Host "Error downloading image: $_"
} 