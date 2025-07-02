import fs from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Función para copiar la estructura de directorios
async function copyDirectoryStructure(sourceDir, targetDir) {
  try {
    // Obtener todos los subdirectorios del directorio fuente
    const getDirectories = async (dir) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      const dirs = entries
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(dir, entry.name));
      
      // Recursivamente obtener subdirectorios
      const subdirs = await Promise.all(dirs.map(d => getDirectories(d)));
      return [dir, ...dirs, ...subdirs.flat()];
    };
    
    // Obtener todos los directorios y subdirectorios
    const allDirs = await getDirectories(sourceDir);
    
    // Crear la misma estructura en el directorio destino
    for (const dir of allDirs) {
      // Obtener la ruta relativa
      const relativePath = path.relative(sourceDir, dir);
      if (relativePath) {
        const targetPath = path.join(targetDir, relativePath);
        // Crear el directorio si no existe
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
          console.log(`Creado directorio: ${targetPath}`);
        }
        
        // También crear en el directorio WebP
        const webpPath = path.join(WEBP_DIR, relativePath);
        if (!fs.existsSync(webpPath)) {
          fs.mkdirSync(webpPath, { recursive: true });
          console.log(`Creado directorio WebP: ${webpPath}`);
        }
      }
    }
    
    console.log('Estructura de directorios copiada correctamente');
  } catch (error) {
    console.error('Error al copiar estructura de directorios:', error);
  }
}

// Función principal
async function main() {
  // Primero copiar la estructura de directorios
  await copyDirectoryStructure(SOURCE_DIR, OUTPUT_DIR);
  
  // Luego optimizar las imágenes
  await optimizeImages();
}

// Ejecutar el script
main().catch(error => {
  console.error('Error en el proceso de optimización:', error);
  process.exit(1);
});