import { Pack } from '../types';

export const packs: Pack[] = [
  // Packs de Coleccionables
  {
    id: 'pack-promesa-1',
    name: 'PROMESA',
    description: 'Ideal para quienes quieren empezar la colección con algo especial',
    price: 28.00,
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye: \n• 1 x Camiseta aleatoria\ \n• 1 x Pulsera\n• 1 x Tarjeta de agradecimiento\n• 2 x Pegatinas (sorpresa)\n• 8 x Cromos de futbolistas (aleatorios)',
    notes: 'El pack perfecto para iniciarte en el mundo del coleccionismo.'
  },
  {
    id: 'pack-profesional-1',
    name: 'PROFESIONAL',
    description: 'Para fans que quieren algo más exclusivo. Sorpréndete con más contenido',
    price: 32.50,
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye: \n• 1 x Camiseta aleatoria\ \n• 1 x Pulsera\n• 1 x Llavero estilo carta FIFA\n• 1 x Foto de futbolista (sorpresa)\n• 4 x Pegatinas\n• 8 x Cromos\n• 🏅 1 x Tarjeta dorada → ¡Participa en un sorteo mensual de una camiseta oficial!',
    notes: 'Para verdaderos aficionados que buscan algo más que una camiseta.'
  },
  {
    id: 'pack-icono-1',
    name: 'ICONO',
    description: 'La experiencia completa. Este pack lo tiene TODO. Hecho para verdaderos fans',
    price: 39.99,
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye: \n• 1 x Camiseta aleatoria\ \n• 1 x Pulsera\n• 1 x Llavero\n• 1 x Lanyard\n• 1 x Foto de futbolista\n• 6 x Pegatinas\n• 8 x Cromos\n• 🏅 1 x Tarjeta dorada → ¡Participa en un sorteo mensual de una camiseta oficial!',
    notes: 'La experiencia definitiva para coleccionistas. Todo lo que un verdadero fan necesita.'
  },
  // Packs x5
  {
    id: 'pack-promesa-5',
    name: 'PROMESA x5',
    description: '5 Packs Promesa - Ideal para grupos que quieren empezar juntos',
    price: 125.00, // 25€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x5): \n• 5 x Camiseta aleatoria\ \n• 5 x Pulseras\n• 5 x Tarjetas de agradecimiento\n• 10 x Pegatinas (sorpresa)\n• 40 x Cromos de futbolistas (aleatorios)\n• ¡Ahorra 15€!',
    notes: 'Pack grupal con descuento especial. Ideal para grupos o coleccionistas.'
  },
  {
    id: 'pack-profesional-5',
    name: 'PROFESIONAL x5',
    description: '5 Packs Profesional - Para grupos de fans exclusivos',
    price: 150.00, // 30€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x5): \n• 5 x Camiseta aleatoria\ \n• 5 x Pulseras\n• 5 x Llaveros estilo carta FIFA\n• 5 x Fotos de futbolista (sorpresa)\n• 20 x Pegatinas\n• 40 x Cromos\n• 🏅 5 x Tarjetas doradas → ¡5 participaciones en sorteos!\n• ¡Ahorra 12.50€!',
    notes: 'Pack grupal con extras para cada pack. ¡Ideal para grupos que quieren más!'
  },
  {
    id: 'pack-icono-5',
    name: 'ICONO x5',
    description: '5 Packs Icono - La experiencia completa para grupos',
    price: 175.00, // 35€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x5): \n• 5 x Camiseta aleatoria\ \n• 5 x Pulseras\n• 5 x Llaveros\n• 5 x Lanyards\n• 5 x Fotos de futbolista\n• 30 x Pegatinas\n• 40 x Cromos\n• 🏅 5 x Tarjetas doradas → ¡5 participaciones en sorteos!\n• ¡Ahorra 25€!',
    notes: 'La experiencia coleccionista definitiva multiplicada por 5. ¡Ideal para grupos de fans!'
  },
  // Packs x10
  {
    id: 'pack-promesa-10',
    name: 'PROMESA x10',
    description: '10 Packs Promesa - Máximo ahorro para grandes grupos',
    price: 230.00, // 23€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x10): \n• 10 x Camiseta aleatoria\ \n• 10 x Pulseras\n• 10 x Tarjetas de agradecimiento\n• 20 x Pegatinas (sorpresa)\n• 80 x Cromos de futbolistas (aleatorios)\n• ¡Ahorra 50€!',
    notes: 'Máximo ahorro para grandes pedidos. ¡La mejor opción para grupos completos!'
  },
  {
    id: 'pack-profesional-10',
    name: 'PROFESIONAL x10',
    description: '10 Packs Profesional - Para grandes grupos de fans exclusivos',
    price: 275.00, // 27.50€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x10): \n• 10 x Camiseta aleatoria\ \n• 10 x Pulseras\n• 10 x Llaveros estilo carta FIFA\n• 10 x Fotos de futbolista (sorpresa)\n• 40 x Pegatinas\n• 80 x Cromos\n• 🏅 10 x Tarjetas doradas → ¡10 participaciones en sorteos!\n• ¡Ahorra 50€!',
    notes: 'Máximo ahorro con todos los extras. ¡Perfecto para grupos completos!'
  },
  {
    id: 'pack-icono-10',
    name: 'ICONO x10',
    description: '10 Packs Icono - La experiencia definitiva para grandes grupos',
    price: 320.00, // 32€ por pack
    jerseyCount: 0,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye (x10): \n• 10 x Camiseta aleatoria\ \n• 10 x Pulseras\n• 10 x Llaveros\n• 10 x Lanyards\n• 10 x Fotos de futbolista\n• 60 x Pegatinas\n• 80 x Cromos\n• 🏅 10 x Tarjetas doradas → ¡10 participaciones en sorteos!\n• ¡Ahorra 80€!',
    notes: 'La mejor oferta para grandes grupos. ¡La experiencia coleccionista definitiva al mejor precio!'
  }
];