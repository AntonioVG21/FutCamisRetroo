// Script para añadir códigos de descuento
import { createDiscount } from '../src/services/discountServices.js';
import { db } from '../src/lib/firebase.js';

async function createDiscounts() {
  const codes = ['claudita12', 'livergol', 'franmoreno', 'chiquitin', 'ligaiberos', 'rayoomann'];
  
  console.log('Creando códigos de descuento del 15%...');
  
  for (const code of codes) {
    try {
      const success = await createDiscount(code, 15, 999999);
      if (success) {
        console.log(`Código de descuento ${code.toUpperCase()} creado con éxito`);
      } else {
        console.error(`Error al crear el código ${code.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Error al crear el código ${code.toUpperCase()}:`, error);
    }
  }
  
  console.log('Proceso completado.');
  process.exit(0);
}

createDiscounts();