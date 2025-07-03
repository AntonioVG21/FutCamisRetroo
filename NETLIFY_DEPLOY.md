# Guía de Despliegue en Netlify

## Configuración de Variables de Entorno

Para que la aplicación funcione correctamente en Netlify, es necesario configurar las siguientes variables de entorno:

### Variables de Firebase

```
VITE_FIREBASE_API_KEY=AIzaSyAm00tZ3sBgdxXpYRnCgmVhFLlKZ-X0C4k
VITE_FIREBASE_AUTH_DOMAIN=futcamisretros-b2413.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=futcamisretros-b2413
VITE_FIREBASE_STORAGE_BUCKET=futcamisretros-b2413.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=917265355922
VITE_FIREBASE_APP_ID=1:917265355922:web:650947024c0efa3a78424b
VITE_FIREBASE_MEASUREMENT_ID=G-C45EQ17CFC
```


## Pasos para el Despliegue

1. **Configurar Variables de Entorno en Netlify**:
   - Ve a la configuración de tu sitio en Netlify
   - Navega a "Site settings" > "Build & deploy" > "Environment variables"
   - Añade todas las variables mencionadas anteriormente

2. **Configurar Redirecciones y Headers**:
   - Los archivos `_redirects` y `_headers` ya están configurados en la carpeta `public/`
   - Estos archivos se copiarán automáticamente a la carpeta de distribución durante la compilación

3. **Configurar Opciones de Compilación**:
   - Comando de compilación: `npm run build`
   - Directorio de publicación: `dist`

4. **Solución de Problemas con Códigos de Descuento**:
   Si los códigos de descuento no funcionan en producción, verifica:
   
   - Que todas las variables de entorno estén correctamente configuradas en Netlify
   - Que los headers CORS estén correctamente configurados
   - Revisa los logs de la consola del navegador para identificar errores específicos
   - Verifica que la colección `discounts` exista en Firestore y contenga documentos válidos

## Verificación Post-Despliegue

Después de desplegar, verifica que:

1. La aplicación carga correctamente
2. Los códigos de descuento funcionan
3. No hay errores CORS en la consola del navegador
4. Las conexiones a Firebase se establecen correctamente

## Comandos Útiles

- Para verificar las variables de entorno localmente: `npm run check-env`
- Para compilar localmente: `npm run build`
- Para previsualizar la compilación: `npm run preview`