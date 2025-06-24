export interface League {
  id: string;
  name: string;
  icon: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  isRetro?: boolean;
  teams?: string[];
}

export interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  price: number;
  image: string; // Mantener para compatibilidad con código existente
  images?: string[]; // Array de URLs de imágenes
  isRetro?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
  isKids?: boolean;
  description?: string;
  customization?: {
    name: string;
    number: string;
    price: number;
  };
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  jerseyCount: number;
  freeJerseys?: number;
  image: string;
  specifications?: string;
  notes?: string;
  isPack?: boolean;
  type?: 'promesa' | 'profesional' | 'icono';
}

export enum Teams {
  ALEMANIA = "Alemania",
  ARGENTINA = "Argentina",
  BRASIL = "Brasil",
  CROACIA = "Croacia",
  ESCOCIA = "Escocia",
  FRANCIA = "Francia",
  INGLATERRA = "Inglaterra",
  PAISES_BAJOS = "Países Bajos",
  PORTUGAL = "Portugal",
  ESPAÑA = "España",
  JAPON = "Japón",

  ARSENAL = "Arsenal",
  ATLETICO_DE_MADRID = "Atletico de Madrid",
  BARCELONA = "Barcelona",
  BAYERN_MUNICH = "Bayern Munich",
  BOTAFOGO = "Botafogo",
  BORUSSIA_DORTMUND = "Borussia Dortmund",
  CELTIC = "Celtic",
  CHELSEA = "Chelsea",
  DEPORTIVO_LA_CORUNA = "Deportivo La Coruña",
  INTER_DE_MILAN = "Inter de Milán",
  JUVENTUS = "Juventus",
  LAZIO = "Lazio",
  LIVERPOOL = "Liverpool",
  LOS_ANGELES_GALAXY = "Los Angeles Galaxy",
  MANCHESTER_CITY = "Manchester City",
  MANCHESTER_UNITED = "Manchester United",
  AC_MILAN = "Ac Milan",
  NEWCASTLE_UNITED = "Newcastle United",
  OLYMPIQUE_DE_MARSEILLA = "Olympique de Marsella",
  PARIS_SAINT_GERMAIN = "PSG",
  REAL_BETIS = "Real Betis",
  REAL_MADRID = "Real Madrid",
  SANTOS = "Santos",
  MONACO = "Mónaco",
  SPORTING_DE_LISBOA = "Sporting de Lisboa",
  RIVER_PLATE = "River Plate",
  AJAX = "Ajax",
  INTER_MIAMI = "Inter Miami",
  NAPOLES = "Nápoles",
  VALENCIA = "Valencia",
  ROMA = "Roma",
}

export enum Equipment_Type{
  PRIMERA = "1era Equipación",
  SEGUNDA = "2da Equipación",
  TERCERA = "3ra Equipación",
  ESPECIAL = "Edicion especial",
}