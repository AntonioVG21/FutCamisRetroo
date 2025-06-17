const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');

// Directorios de origen y destino
const SOURCE_DIR = path.join(__dirname, '../public/imagenes');
const OUTPUT_DIR = path.join(__dirname, '../public/imagenes/optimized');

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Función para optimizar imágenes
async function optimizeImages() {
  console.log('Optimizando imágenes...');
  
  try {
    // Optimizar JPG
    await imagemin([`${SOURCE_DIR}/**/*.{jpg,jpeg}`], {
      destination: OUTPUT_DIR,
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true
        })
      ]
    });
    
    // Convertir a WebP
    await imagemin([`${SOURCE_DIR}/**/*.{jpg,jpeg,png}`], {
      destination: OUTPUT_DIR,
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });
    
    console.log('Imágenes optimizadas correctamente!');
  } catch (error) {
    console.error('Error al optimizar imágenes:', error);
  }
}

// Ejecutar la optimización
optimizeImages();