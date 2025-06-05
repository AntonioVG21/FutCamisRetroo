import { Pack } from '../types';

export const packs: Pack[] = [
  // Packs Individuales
  {
    id: 'pack-promesa-1',
    name: 'Pack Promesa',
    description: 'Ideal para quienes quieren empezar la colección con algo especial.',
    price: 28.00,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 x Pulsera\n- 1 x Tarjeta de agradecimiento\n- 2 x Pegatinas (sorpresa)\n- 8 x Cromos de futbolistas (aleatorios)',
    notes: '🟢 PACK "PROMESA" – 28€',
    type: 'promesa'
  },
  {
    id: 'pack-profesional-1',
    name: 'Pack Profesional',
    description: 'Para fans que quieren algo más exclusivo. Sorpréndete con más contenido.',
    price: 32.50,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 x Pulsera\n- 1 x Llavero estilo carta FIFA\n- 1 x Foto de futbolista (sorpresa)\n- 4 x Pegatinas\n- 8 x Cromos\n- 🏅 1 x Tarjeta dorada → ¡Participa en un sorteo mensual de una camiseta oficial!',
    notes: '🔵 PACK "PROFESIONAL" – 32,50€',
    type: 'profesional'
  },
  {
    id: 'pack-icono-1',
    name: 'Pack Icono',
    description: 'La experiencia completa. Este pack lo tiene TODO. Hecho para verdaderos fans.',
    price: 39.99,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 x Pulsera\n- 1 x Llavero\n- 1 x Lanyard\n- 1 x Foto de futbolista\n- 6 x Pegatinas\n- 8 x Cromos\n- 🏅 1 x Tarjeta dorada → ¡Participa en un sorteo mensual de una camiseta oficial!',
    notes: '🟡 PACK "ICONO" – 39,99€',
    type: 'icono'
  },
  // Packs x5
  {
    id: 'pack-promesa-5',
    name: 'Pack Promesa x5',
    description: '5 Packs Promesa con descuento',
    price: 125.00, // 25€ por pack
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 x Pulseras\n- 5 x Tarjetas de agradecimiento\n- 10 x Pegatinas (sorpresa)\n- 40 x Cromos de futbolistas (aleatorios)\n- ¡Ahorra 15€!',
    notes: '🟢 PACK "PROMESA" x5 – Ahorro de 15€',
    type: 'promesa'
  },
  {
    id: 'pack-profesional-5',
    name: 'Pack Profesional x5',
    description: '5 Packs Profesional con descuento',
    price: 150.00, // 30€ por pack
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 x Pulseras\n- 5 x Llaveros estilo carta FIFA\n- 5 x Fotos de futbolistas (sorpresa)\n- 20 x Pegatinas\n- 40 x Cromos\n- 🏅 5 x Tarjetas doradas → ¡Participa en sorteos mensuales de camisetas oficiales!\n- ¡Ahorra 12.50€!',
    notes: '🔵 PACK "PROFESIONAL" x5 – Ahorro de 12.50€',
    type: 'profesional'
  },
  {
    id: 'pack-icono-5',
    name: 'Pack Icono x5',
    description: '5 Packs Icono con descuento',
    price: 175.00, // 35€ por pack
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 x Pulseras\n- 5 x Llaveros\n- 5 x Lanyards\n- 5 x Fotos de futbolistas\n- 30 x Pegatinas\n- 40 x Cromos\n- 🏅 5 x Tarjetas doradas → ¡Participa en sorteos mensuales de camisetas oficiales!\n- ¡Ahorra 25€!',
    notes: '🟡 PACK "ICONO" x5 – Ahorro de 25€',
    type: 'icono'
  },
  // Packs x10
  {
    id: 'pack-promesa-10',
    name: 'Pack Promesa x10',
    description: '10 Packs Promesa con descuento máximo',
    price: 230.00, // 23€ por pack
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 x Pulseras\n- 10 x Tarjetas de agradecimiento\n- 20 x Pegatinas (sorpresa)\n- 80 x Cromos de futbolistas (aleatorios)\n- ¡Ahorra 50€!',
    notes: '🟢 PACK "PROMESA" x10 – Ahorro de 50€',
    type: 'promesa'
  },
  {
    id: 'pack-profesional-10',
    name: 'Pack Profesional x10',
    description: '10 Packs Profesional con descuento máximo',
    price: 275.00, // 27.50€ por pack
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 x Pulseras\n- 10 x Llaveros estilo carta FIFA\n- 10 x Fotos de futbolistas (sorpresa)\n- 40 x Pegatinas\n- 80 x Cromos\n- 🏅 10 x Tarjetas doradas → ¡Participa en sorteos mensuales de camisetas oficiales!\n- ¡Ahorra 50€!',
    notes: '🔵 PACK "PROFESIONAL" x10 – Ahorro de 50€',
    type: 'profesional'
  },
  {
    id: 'pack-icono-10',
    name: 'Pack Icono x10',
    description: '10 Packs Icono con descuento máximo',
    price: 320.00, // 32€ por pack
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 x Pulseras\n- 10 x Llaveros\n- 10 x Lanyards\n- 10 x Fotos de futbolistas\n- 60 x Pegatinas\n- 80 x Cromos\n- 🏅 10 x Tarjetas doradas → ¡Participa en sorteos mensuales de camisetas oficiales!\n- ¡Ahorra 80€!',
    notes: '🟡 PACK "ICONO" x10 – Ahorro de 80€',
    type: 'icono'
  }
];