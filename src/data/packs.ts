import { Pack } from '../types';

export const packs: Pack[] = [
  // Packs Individuales
  {
    id: 'pack-promesa-1',
    name: 'Pack Promesa',
    description: 'Camiseta sorpresa',
    price: 28.00,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 Camiseta sorpresa\n- Pegatinas exclusivas',
    notes: 'El pack perfecto para iniciarte en el mundo del coleccionismo.'
  },
  {
    id: 'pack-profesional-1',
    name: 'Pack Profesional',
    description: 'Camiseta + Extras',
    price: 32.50,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 Camiseta sorpresa\n- Pegatina exclusiva\n- Llavero coleccionable',
    notes: 'Para verdaderos aficionados que buscan algo más que una camiseta.'
  },
  {
    id: 'pack-icono-1',
    name: 'Pack Icono',
    description: 'Pack Coleccionista Completo',
    price: 40.00,
    jerseyCount: 1,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 1 Camiseta sorpresa\n- Pegatina exclusiva\n- Llavero coleccionable\n- Lanyard personalizado\n- Set de cromos\n- Foto de futbolista',
    notes: 'La experiencia definitiva para coleccionistas. Todo lo que un verdadero fan necesita.'
  },
  // Packs x5
  {
    id: 'pack-promesa-5',
    name: 'Pack Promesa x5',
    description: '5 Camisetas sorpresa',
    price: 125.00, // 25€ por camiseta
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 Camisetas sorpresa\n- Pegatinas exclusivas\n- ¡Ahorra 15€!',
    notes: 'Pack grupal con descuento especial. Ideal para grupos o coleccionistas.'
  },
  {
    id: 'pack-profesional-5',
    name: 'Pack Profesional x5',
    description: '5 Camisetas + Extras',
    price: 150.00, // 30€ por pack
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 Camisetas sorpresa\n- 5 Pegatinas exclusivas\n- 5 Llaveros coleccionables\n- ¡Ahorra 12.50€!',
    notes: 'Pack grupal con extras para cada camiseta. ¡Ideal para equipos que quieren más!'
  },
  {
    id: 'pack-icono-5',
    name: 'Pack Icono x5',
    description: '5 Packs Coleccionista',
    price: 175.00, // 35€ por pack
    jerseyCount: 5,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 5 Camisetas sorpresa\n- 5 Sets completos de coleccionista\n(Pegatinas, llaveros, lanyards, cromos y fotos)\n- ¡Ahorra 25€!',
    notes: 'La experiencia coleccionista definitiva multiplicada por 5. ¡Ideal para grupos de fans!'
  },
  // Packs x10
  {
    id: 'pack-promesa-10',
    name: 'Pack Promesa x10',
    description: '10 Camisetas sorpresa',
    price: 230.00, // 23€ por camiseta
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 Camisetas sorpresa\n- Pegatinas exclusivas\n- ¡Ahorra 50€!',
    notes: 'Máximo ahorro para grandes pedidos. ¡La mejor opción para equipos completos!'
  },
  {
    id: 'pack-profesional-10',
    name: 'Pack Profesional x10',
    description: '10 Camisetas + Extras',
    price: 275.00, // 27.50€ por pack
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 Camisetas sorpresa\n- 10 Pegatinas exclusivas\n- 10 Llaveros coleccionables\n- ¡Ahorra 50€!',
    notes: 'Máximo ahorro con todos los extras. ¡Perfecto para equipos completos!'
  },
  {
    id: 'pack-icono-10',
    name: 'Pack Icono x10',
    description: '10 Packs Coleccionista',
    price: 320.00, // 32€ por pack
    jerseyCount: 10,
    freeJerseys: 0,
    image: 'https://images.pexels.com/photos/9789826/pexels-photo-9789826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isPack: true,
    specifications: 'Incluye:\n- 10 Camisetas sorpresa\n- 10 Sets completos de coleccionista\n(Pegatinas, llaveros, lanyards, cromos y fotos)\n- ¡Ahorra 80€!',
    notes: 'La mejor oferta para grandes grupos. ¡La experiencia coleccionista definitiva al mejor precio!'
  }
];