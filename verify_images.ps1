# Script para verificar que todas las imágenes referenciadas en jerseys.ts existen en la carpeta camisetas-web

# Ruta al directorio de imágenes
$imagePath = "c:\Users\anton\OneDrive\Escritorio\TiendaOficial\public\imagenes\camisetas-web\"

# Obtener todos los archivos en el directorio
$existingFiles = Get-ChildItem -Path $imagePath | Select-Object -ExpandProperty Name

# Extraer nombres de archivos de jerseys.ts
$jerseysTsPath = "c:\Users\anton\OneDrive\Escritorio\TiendaOficial\src\data\jerseys.ts"
$content = Get-Content -Path $jerseysTsPath -Raw

# Buscar todas las referencias a imágenes en camisetas-web
$pattern = '\"/imagenes/camisetas-web/([^\"]+)\"'
$matches = [regex]::Matches($content, $pattern)

$referencedFiles = @()
foreach ($match in $matches) {
    $referencedFiles += $match.Groups[1].Value
}

# Encontrar archivos referenciados que no existen
$missingFiles = @()
foreach ($file in $referencedFiles) {
    if ($existingFiles -notcontains $file) {
        $missingFiles += $file
    }
}

# Mostrar resultados
Write-Host "Total de archivos referenciados: $($referencedFiles.Count)"
Write-Host "Total de archivos existentes: $($existingFiles.Count)"

if ($missingFiles.Count -gt 0) {
    Write-Host "Archivos faltantes ($($missingFiles.Count)):"
    foreach ($file in $missingFiles) {
        Write-Host "  - $file"
    }
} else {
    Write-Host "¡Todas las imágenes referenciadas existen!"
}