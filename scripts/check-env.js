#!/usr/bin/env node

/**
 * Script para verificar que las variables de entorno necesarias estén definidas
 * Ejecutar con: node scripts/check-env.js
 */

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

const missingVars = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  } else {
    // Mostrar que la variable está definida (sin mostrar el valor completo por seguridad)
    const value = process.env[envVar];
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
      : '********';
    console.log(`✅ ${envVar}: ${maskedValue}`);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Error: Las siguientes variables de entorno son requeridas pero no están definidas:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\nPor favor, asegúrate de que estas variables estén definidas en tu archivo .env o en la configuración de Netlify.');
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables de entorno requeridas están definidas.');
}