$files = @(
    # Archivos originales
    '102ba103.jpg',
    '271b3298.jpg',
    '8886d2e6.jpg',
    '65307b58.jpg',
    '86238f0c.jpg',
    '91528dcd.jpg',
    'd1ufe7ak.jpg',
    'd498f5c0.jpg',
    'e0f24249.jpg',
    'f2dfb0c1.jpg',
    'fb23e806.jpg',
    'ddjksd123d.jpg',
    '2ddno13i.jpg',
    's-l1200.jpg',
    's-l1201.jpg',
    
    # Archivos adicionales de las últimas páginas
    '2ccef3e6.jpg',
    '2d106c31.jpg',
    '2f17389b.jpg',
    '3016b898.jpg',
    '34a81578.jpg',
    '3c6baaf6.jpg',
    '3d302f69.jpg',
    '4a0e34c7.jpg',
    '4c55aaa2.jpg',
    '5a7a233e.jpg',
    '5cb8c803.jpg',
    '6b90394c.jpg',
    'eb06b3f4.jpg',
    'a0a9f4ef.jpg',
    '1afda40d.jpg',
    '4db3623b.jpg',
    '6be410b8.jpg',
    '060d8d3a.jpg',
    '83c69a9c.jpg'
)

$basePath = "c:\Users\anton\OneDrive\Escritorio\TiendaOficial\public\imagenes\"
$targetPath = "$basePath\camisetas-web\"
$sourcePath = "$basePath\optimized\"

# Asegurarse de que el directorio destino existe
if (-not (Test-Path -Path $targetPath)) {
    New-Item -Path $targetPath -ItemType Directory -Force
    Write-Host "Directorio creado: $targetPath"
}

foreach ($file in $files) {
    $targetFilePath = "$targetPath$file"
    $sourceFilePath = "$sourcePath$file"
    
    # Verificar si el archivo ya existe en la carpeta destino
    if (Test-Path -Path $targetFilePath) {
        Write-Host "El archivo ya existe: $targetFilePath"
        continue
    }
    
    # Intentar copiar desde la carpeta optimized si existe
    if (Test-Path -Path $sourceFilePath) {
        Copy-Item -Path $sourceFilePath -Destination $targetFilePath -Force
        Write-Host "Copiado desde optimized: $targetFilePath"
    } else {
        # Si no existe en optimized, crear un archivo vacío
        New-Item -Path $targetFilePath -ItemType File -Force
        Write-Host "Creado archivo vacío: $targetFilePath"
    }
}