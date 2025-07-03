$files = @(
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
    's-l1201.jpg'
)

$basePath = "c:\Users\anton\OneDrive\Escritorio\TiendaOficial\public\imagenes\camisetas-web\"

foreach ($file in $files) {
    $filePath = $basePath + $file
    New-Item -Path $filePath -ItemType File -Force
    Write-Host "Created: $filePath"
}