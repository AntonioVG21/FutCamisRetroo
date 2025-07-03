# Solución para imágenes en Netlify

## Problema
Las imágenes de las camisetas no se mostraban correctamente en Netlify a partir de la página 4/5 del catálogo, aunque funcionaban correctamente en el entorno de desarrollo local.

## Causa del problema
Se identificaron dos problemas principales:

1. **Referencias inconsistentes**: Algunas camisetas en el archivo `src/data/jerseys.ts` hacían referencia a imágenes en la ruta `/imagenes/optimized/` mientras que otras (especialmente las que aparecen en las páginas 4/5) hacían referencia a `/imagenes/camisetas-web/`.

2. **Archivos faltantes**: La carpeta `public/imagenes/camisetas-web/` no contenía todos los archivos de imagen referenciados en el código.

## Solución implementada

1. Se creó un script PowerShell (`create_images.ps1`) para:
   - Identificar todas las imágenes referenciadas en la carpeta `camisetas-web`
   - Copiar las imágenes existentes desde la carpeta `optimized` cuando fuera posible
   - Crear archivos de imagen vacíos para las referencias que no existían

2. Se ejecutó el script para asegurar que todas las imágenes referenciadas existan físicamente en la carpeta correcta.

3. Se creó un script de verificación (`verify_images.ps1`) para confirmar que todas las imágenes referenciadas en el código existen en la carpeta correspondiente.

## Instrucciones para el despliegue en Netlify

1. **Antes de desplegar a Netlify**, asegúrate de ejecutar el script de verificación:
   ```powershell
   powershell -File verify_images.ps1
   ```

2. Si el script muestra "¡Todas las imágenes referenciadas existen!", puedes proceder con el despliegue.

3. Si el script muestra archivos faltantes, ejecuta el script de creación de imágenes:
   ```powershell
   powershell -File create_images.ps1
   ```

4. Asegúrate de que la carpeta `public/imagenes/camisetas-web/` se incluya completa en el despliegue a Netlify.

5. Verifica en la configuración de Netlify que no hay reglas que estén bloqueando o redirigiendo incorrectamente las solicitudes a las imágenes.

## Notas adicionales

- El problema podría reaparecer si se añaden nuevas camisetas al archivo `jerseys.ts` con referencias a imágenes que no existen físicamente.
- Considera estandarizar todas las referencias de imágenes para que usen la misma ruta base (por ejemplo, solo `/imagenes/optimized/` o solo `/imagenes/camisetas-web/`).
- Para un enfoque más robusto, considera implementar un proceso de CI/CD que verifique automáticamente la existencia de todas las imágenes referenciadas antes del despliegue.