export interface FurnitureType {
  id: string;
  name: string;
  imageUrl: string; // Coloca tu imagen en /publicfurniture/<archivo>
  description: string;
  comingSoon?: boolean;
}

export interface FurnitureModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Coloca tu imagen en /publicfurniture/models/<archivo>
  furnitureTypeId: string;
  comingSoon?: boolean;
}

export interface MelaminaColor {
  id: string;
  name: string;
  hex: string;
  texture?: string;
  category: 'Neutros' | 'Madera' | 'Colores';
  imageUrl?: string;
  available?: boolean;
}

export interface DemoDimensions {
  width: number | null;
  height: number | null;
  depth: number | null;
}

export interface DemoSelection {
  furnitureType: FurnitureType | null;
  model: FurnitureModel | null;
  color: MelaminaColor | null;
  dimensions: DemoDimensions;
}

// ─── Catálogos de datos ───────────────────────────────────────────────────────
// Imágenes: coloca los archivos en /public/furniture/ y /public/furniture/models/
// Formato sugerido: WebP o JPG, proporción 4:3 o cuadrada, fondo blanco/neutro.

export const FURNITURE_TYPES: FurnitureType[] = [
  {
    id: 'ropero',
    name: 'Ropero',
    imageUrl: 'furniture/ropero.webp',
    description: 'Espacio para almacenamiento de todo tipo de prendas de vestir',
    comingSoon: false,
  },
  {
    id: 'repostero',
    name: 'Repostero de Cocina',
    imageUrl: 'furniture/repostero.webp',
    description: 'Organizador y almacenamiento para utensilios de cocina',
    comingSoon: true,
  },
  {
    id: 'entretenimiento',
    name: 'Centro de Entretenimiento',
    imageUrl: 'furniture/entretenimiento.webp',
    description: 'Muebles para sala con estética visual moderna',
    comingSoon: true,
  },
  {
    id: 'zapatero',
    name: 'Zapatero',
    imageUrl: 'furniture/zapatero.webp',
    description: 'Organizador de calzado con diseño funcional',
    comingSoon: true,
  },
  {
    id: 'comoda',
    name: 'Cómoda',
    imageUrl: 'furniture/comoda.webp',
    description: 'Almacenamiento de prendas de vestir y accesorios',
    comingSoon: true,
  },
  {
    id: 'escritorio',
    name: 'Escritorio',
    imageUrl: 'furniture/escritorio.webp',
    description: 'Para trabajo de oficina o setup gamer',
    comingSoon: true,
  },
];

export const FURNITURE_MODELS: FurnitureModel[] = [
  // ─── Ropero ───────────────────────────────────────────────────────────────
  {
    id: 'ropero-2p',
    name: 'Ropero Clásico',
    description: 'Diseño sencillo con zona de colgar y repisas interiores',
    imageUrl: 'furniture/models/r_clasico.webp',
    furnitureTypeId: 'ropero',
    comingSoon: false,
  },
  {
    id: 'ropero-3p-espejo',
    name: 'Ropero Estandar',
    description: 'Puerta central con espejo de cuerpo entero, ideal para dormitorio',
    imageUrl: 'furniture/models/r_standar.webp',
    furnitureTypeId: 'ropero',
    comingSoon: true,
  },
  {
    id: 'ropero-4p',
    name: 'Ropero Premium',
    description: 'Máxima capacidad con cajones internos y zona zapatera',
    imageUrl: 'furniture/models/r_premium.webp',
    furnitureTypeId: 'ropero',
    comingSoon: true,
  },
  {
    id: 'ropero-corredizo',
    name: 'Ropero con puertas Corredizas',
    description: 'Puertas deslizantes, ahorra espacio en habitaciones pequeñas',
    imageUrl: 'furniture/models/r_corredizo.webp',
    furnitureTypeId: 'ropero',
    comingSoon: true,
  },

  // ─── Repostero de Cocina ─────────────────────────────────────────────────
  {
    id: 'repostero-altos',
    name: 'Solo Muebles Altos',
    description: 'Gabinetes altos para almacenamiento sobre el mesón',
    imageUrl: 'furniture/models/repostero-altos.webp',
    furnitureTypeId: 'repostero',
    comingSoon: true,
  },
  {
    id: 'repostero-bajos',
    name: 'Solo Muebles Bajos',
    description: 'Muebles bajos con cubierta, espacio para electrodomésticos',
    imageUrl: 'furniture/models/repostero-bajos.webp',
    furnitureTypeId: 'repostero',
    comingSoon: true,
  },
  {
    id: 'repostero-completo',
    name: 'Cocina Completa',
    description: 'Muebles altos y bajos con campana decorativa y alacena',
    imageUrl: 'furniture/models/repostero-completo.webp',
    furnitureTypeId: 'repostero',
    comingSoon: true,
  },
  {
    id: 'repostero-isla',
    name: 'Con Isla Central',
    description: 'Diseño moderno con barra o isla de preparación',
    imageUrl: 'furniture/models/repostero-isla.webp',
    furnitureTypeId: 'repostero',
    comingSoon: true,
  },

  // ─── Centro de Entretenimiento ────────────────────────────────────────────
  {
    id: 'entret-simple',
    name: 'TV Unit Simple',
    description: 'Mueble bajo para TV con repisas y espacio para equipos',
    imageUrl: 'furniture/models/entret-simple.webp',
    furnitureTypeId: 'entretenimiento',
    comingSoon: true,
  },
  {
    id: 'entret-estantes',
    name: 'Con Estantes Laterales',
    description: 'Panel central TV + estantes laterales para libros y decoración',
    imageUrl: 'furniture/models/entret-estantes.webp',
    furnitureTypeId: 'entretenimiento',
    comingSoon: true,
  },
  {
    id: 'entret-pared',
    name: 'Panel de Pared Completo',
    description: 'Ocupa toda la pared, integra TV, vitrina y almacenamiento',
    imageUrl: 'furniture/models/entret-pared.webp',
    furnitureTypeId: 'entretenimiento',
    comingSoon: true,
  },
  {
    id: 'entret-vitrina',
    name: 'Con Vitrina',
    description: 'Incluye puertas de vidrio para exhibir colecciones o vajilla',
    imageUrl: 'furniture/models/entret-vitrina.webp',
    furnitureTypeId: 'entretenimiento',
    comingSoon: true,
  },

  // ─── Zapatero ─────────────────────────────────────────────────────────────
  {
    id: 'zapatero-abierto',
    name: 'Abierto (3 Niveles)',
    description: 'Repisa escalonada abierta, acceso rápido y ventilado',
    imageUrl: 'furniture/models/zapatero-abierto.webp',
    furnitureTypeId: 'zapatero',
    comingSoon: true,
  },
  {
    id: 'zapatero-puertas',
    name: 'Cerrado con Puertas',
    description: 'Armario zapatero con puertas batientes, estético y ordenado',
    imageUrl: 'furniture/models/zapatero-puertas.webp',
    furnitureTypeId: 'zapatero',
    comingSoon: true,
  },
  {
    id: 'zapatero-asiento',
    name: 'Con Banco y Asiento',
    description: 'Parte superior tapizada para sentarse al calzarse',
    imageUrl: 'furniture/models/zapatero-asiento.webp',
    furnitureTypeId: 'zapatero',
    comingSoon: true,
  },
  {
    id: 'zapatero-torre',
    name: 'Torre Zapatera Alta',
    description: 'Columna estrecha de alta capacidad, ideal para espacios reducidos',
    imageUrl: 'furniture/models/zapatero-torre.webp',
    furnitureTypeId: 'zapatero',
    comingSoon: true,
  },

  // ─── Cómoda ───────────────────────────────────────────────────────────────
  {
    id: 'comoda-4c',
    name: '4 Cajones',
    description: 'Cómoda estándar con 4 cajones de diferente tamaño',
    imageUrl: 'furniture/models/comoda-4c.webp',
    furnitureTypeId: 'comoda',
    comingSoon: true,
  },
  {
    id: 'comoda-6c',
    name: '6 Cajones',
    description: 'Mayor capacidad para organizar ropa y accesorios',
    imageUrl: 'furniture/models/comoda-6c.webp',
    furnitureTypeId: 'comoda',
    comingSoon: true,
  },
  {
    id: 'comoda-espejo',
    name: 'Con Espejo Superior',
    description: 'Cómoda con espejo montado ideal para tocador',
    imageUrl: 'furniture/models/comoda-espejo.webp',
    furnitureTypeId: 'comoda',
    comingSoon: true,
  },
  {
    id: 'comoda-puertas',
    name: 'Con Puertas Laterales',
    description: 'Combinación de cajones centrales y puertas a los costados',
    imageUrl: 'furniture/models/comoda-puertas.webp',
    furnitureTypeId: 'comoda',
    comingSoon: true,
  },

  // ─── Escritorio ───────────────────────────────────────────────────────────
  {
    id: 'escritorio-simple',
    name: 'Simple con Cajonera',
    description: 'Tablero recto con pedestal de cajones lateral',
    imageUrl: 'furniture/models/escritorio-simple.webp',
    furnitureTypeId: 'escritorio',
    comingSoon: true,
  },
  {
    id: 'escritorio-l',
    name: 'En L (Esquinero)',
    description: 'Forma en L para aprovechar la esquina del cuarto',
    imageUrl: 'furniture/models/escritorio-l.webp',
    furnitureTypeId: 'escritorio',
    comingSoon: true,
  },
  {
    id: 'escritorio-gamer',
    name: 'Setup Gamer',
    description: 'Escritorio amplio con gestión de cables y estante para monitores',
    imageUrl: 'furniture/models/escritorio-gamer.webp',
    furnitureTypeId: 'escritorio',
    comingSoon: true,
  },
  {
    id: 'escritorio-estante',
    name: 'Con Estante Superior',
    description: 'Repisa montada sobre el escritorio para libros y pantalla',
    imageUrl: 'furniture/models/escritorio-estante.webp',
    furnitureTypeId: 'escritorio',
    comingSoon: true,
  },
];

export const MELAMINA_COLORS: MelaminaColor[] = [
  // Neutros
  {
    id: 'blanco',
    name: 'Blanco Nieve',
    hex: '#F8F8F8',
    category: 'Neutros',
    imageUrl: 'furniture/colors/blanco.webp',
    available: true,
  },
  {
    id: 'nacar',
    name: 'Nácar',
    hex: '#EBE5D9',
    category: 'Neutros',
    imageUrl: 'furniture/colors/nacar.webp',
    available: true,
  },
  { id: 'gris-perla', name: 'Gris Perla', hex: '#D9D9D9', category: 'Neutros', available: false },
  {
    id: 'gris-oscuro',
    name: 'Gris Antracita',
    hex: '#4A4A4A',
    category: 'Neutros',
    available: false,
  },
  { id: 'negro', name: 'Negro Grafito', hex: '#1C1C1C', category: 'Neutros', available: false },
  // Madera
  {
    id: 'bellota',
    name: 'Bellota',
    hex: '#8B5A2B',
    category: 'Madera',
    imageUrl: 'furniture/colors/bellota.webp',
    available: true,
  },
  {
    id: 'cedro',
    name: 'Cedro',
    hex: '#8B4513',
    category: 'Madera',
    imageUrl: 'furniture/colors/cedro.webp',
    available: true,
  },
  {
    id: 'panela',
    name: 'Panela',
    hex: '#D4A96A',
    category: 'Madera',
    imageUrl: 'furniture/colors/panela.webp',
    available: true,
  },
  { id: 'roble-claro', name: 'Roble Claro', hex: '#C8A882', category: 'Madera', available: false },
  {
    id: 'roble-oscuro',
    name: 'Roble Oscuro',
    hex: '#7B5135',
    category: 'Madera',
    available: false,
  },
  { id: 'nogal', name: 'Nogal', hex: '#5C3D2E', category: 'Madera', available: false },
  { id: 'pino', name: 'Pino Natural', hex: '#D4A96A', category: 'Madera', available: false },
  { id: 'wengue', name: 'Wengué', hex: '#3B2314', category: 'Madera', available: false },
  // Colores
  // { id: 'azul-navy', name: 'Azul Navy', hex: '#1E3A5F', category: 'Colores', available: false },
  // { id: 'verde-salvia', name: 'Verde Salvia', hex: '#7C9A7E', category: 'Colores', available: false },
  // { id: 'terracota', name: 'Terracota', hex: '#C1603A', category: 'Colores', available: false },
  // { id: 'bordo', name: 'Bordo', hex: '#7B1D1D', category: 'Colores', available: false },
];
