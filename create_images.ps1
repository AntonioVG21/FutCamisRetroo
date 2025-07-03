# No usaremos una lista predefinida, copiaremos todas las imágenes de optimized a camisetas-web
# y crearemos placeholders para los archivos que no existen en optimized

$basePath = "c:\Users\anton\OneDrive\Escritorio\TiendaOficial\public\imagenes\"
$targetPath = "$basePath\camisetas-web\"
$sourcePath = "$basePath\optimized\"
$placeholderPath = "$basePath\placeholder.jpg"

# Asegurarse de que el directorio destino existe
if (-not (Test-Path -Path $targetPath)) {
    New-Item -Path $targetPath -ItemType Directory -Force
    Write-Host "Directorio creado: $targetPath"
}

# Buscar una imagen existente para usar como placeholder
$existingImages = Get-ChildItem -Path $sourcePath -File | Where-Object { $_.Length -gt 0 } | Select-Object -First 1

if ($existingImages) {
    # Usar la primera imagen encontrada como placeholder
    $placeholderPath = $existingImages.FullName
    Write-Host "Usando imagen existente como placeholder: $placeholderPath"
} else {
    Write-Host "No se encontraron imágenes existentes para usar como placeholder"
    exit 1
}

# Obtener todos los archivos de la carpeta optimized
$optimizedFiles = Get-ChildItem -Path $sourcePath -File | Select-Object -ExpandProperty Name

Write-Host "Se encontraron $($optimizedFiles.Count) archivos en la carpeta optimized"

# Copiar todos los archivos de optimized a camisetas-web
foreach ($file in $optimizedFiles) {
    $targetFilePath = "$targetPath$file"
    $sourceFilePath = "$sourcePath$file"
    
    # Verificar si el archivo ya existe en la carpeta destino y si tiene contenido
    if (Test-Path -Path $targetFilePath) {
        $fileInfo = Get-Item -Path $targetFilePath
        if ($fileInfo.Length -gt 0) {
            Write-Host "El archivo ya existe con contenido: $targetFilePath"
            continue
        } else {
            Write-Host "El archivo existe pero está vacío, reemplazando: $targetFilePath"
        }
    }
    
    # Copiar el archivo desde optimized
    Copy-Item -Path $sourceFilePath -Destination $targetFilePath -Force
    Write-Host "Copiado desde optimized: $targetFilePath"
}

# Verificar si hay archivos en camisetas-web que no tienen contenido
$emptyFiles = Get-ChildItem -Path $targetPath -File | Where-Object { $_.Length -eq 0 } | Select-Object -ExpandProperty Name

if ($emptyFiles.Count -gt 0) {
    Write-Host "Se encontraron $($emptyFiles.Count) archivos vacíos en camisetas-web"
    Write-Host "Estos archivos no tienen una versión en la carpeta optimized"
    
    # Reemplazar archivos vacíos con el placeholder
    foreach ($emptyFile in $emptyFiles) {
        $emptyFilePath = "$targetPath$emptyFile"
        Copy-Item -Path $placeholderPath -Destination $emptyFilePath -Force
        Write-Host "Reemplazado archivo vacío con placeholder: $emptyFilePath"
    }
}