import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (desarrollo/producción)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Registra las variables de entorno para depuración
  console.log('Modo:', mode);
  console.log('Variables de entorno cargadas:', Object.keys(env).filter(key => key.startsWith('VITE_')));
  
  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'FutCamisRetros',
        short_name: 'FutCamisRetros',
        theme_color: '#0c0c14',
        icons: [
          {
            src: '/imagenes/optimized/Logo-removebg-preview.webp',
            sizes: '192x192',
            type: 'image/webp',
          },
          {
            src: '/imagenes/optimized/Logo-removebg-preview.webp',
            sizes: '512x512',
            type: 'image/webp',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true, // Habilitar sourcemaps para depuración
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantener mensajes de consola para depuración
        drop_debugger: false, // Mantener debugger para depuración
      },
    },
    // Asegurarse de que las variables de entorno estén disponibles
    envPrefix: 'VITE_',
  },
  };
});