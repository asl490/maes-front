export interface FurnitureType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface FurnitureModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  furnitureTypeId: string;
}

export interface MelaminaColor {
  id: string;
  name: string;
  hex: string;
  texture?: string;
  category: 'Neutros' | 'Madera' | 'Colores';
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

export const FURNITURE_TYPES: FurnitureType[] = [
  {
    id: 'ropero',
    name: 'Ropero',
    icon: '🪞',
    description: 'Roperos de 2, 3 o más puertas con distintos interiores',
  },
  {
    id: 'closet',
    name: 'Clóset',
    icon: '👗',
    description: 'Clósets empotrados con división de ropa y accesorios',
  },
  {
    id: 'cocina',
    name: 'Cocina',
    icon: '🍳',
    description: 'Muebles bajos y altos para cocina moderna o clásica',
  },
  {
    id: 'escritorio',
    name: 'Escritorio',
    icon: '💻',
    description: 'Escritorios de trabajo con cajones y organizadores',
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    icon: '📚',
    description: 'Estantes y bibliotecas a medida para todo tipo de espacio',
  },
  {
    id: 'cama',
    name: 'Cama',
    icon: '🛏️',
    description: 'Bases de cama con cajones o plataforma',
  },
];

export const FURNITURE_MODELS: FurnitureModel[] = [
  // Roperos
  { id: 'ropero-2p', name: '2 Puertas Clásico', description: 'Diseño tradicional con espacio amplio para colgar y doblar', imageUrl: '', furnitureTypeId: 'ropero' },
  { id: 'ropero-3p', name: '3 Puertas con Espejo', description: 'Centro con espejo de cuerpo entero, perfecto para dormitorio', imageUrl: '', furnitureTypeId: 'ropero' },
  { id: 'ropero-4p', name: '4 Puertas Premium', description: 'Máxima capacidad con cajones internos y zapatera', imageUrl: '', furnitureTypeId: 'ropero' },
  // Clósets
  { id: 'closet-lineal', name: 'Lineal Simple', description: 'Distribución lineal optimizada para cuartos medianos', imageUrl: '', furnitureTypeId: 'closet' },
  { id: 'closet-l', name: 'Forma en L', description: 'Aprovecha las esquinas con módulos en forma de L', imageUrl: '', furnitureTypeId: 'closet' },
  { id: 'closet-walk-in', name: 'Walk-in Closet', description: 'Clóset caminable con zona central de trabajo', imageUrl: '', furnitureTypeId: 'closet' },
  // Cocinas
  { id: 'cocina-bajo', name: 'Solo Bajos', description: 'Muebles bajos con cubierta, lavadero y cajones', imageUrl: '', furnitureTypeId: 'cocina' },
  { id: 'cocina-completa', name: 'Cocina Completa', description: 'Muebles altos y bajos con campana y alacena', imageUrl: '', furnitureTypeId: 'cocina' },
  { id: 'cocina-isla', name: 'Con Isla Central', description: 'Diseño moderno con barra o isla de trabajo', imageUrl: '', furnitureTypeId: 'cocina' },
  // Escritorios
  { id: 'escritorio-simple', name: 'Escritorio Simple', description: 'Tablero con cajonera lateral para oficina o estudio', imageUrl: '', furnitureTypeId: 'escritorio' },
  { id: 'escritorio-esquinero', name: 'Escritorio Esquinero', description: 'Forma en L para aprovechar la esquina del cuarto', imageUrl: '', furnitureTypeId: 'escritorio' },
  // Bibliotecas
  { id: 'biblioteca-simple', name: 'Biblioteca Simple', description: 'Estantería de 5 paños ideal para libros y decoración', imageUrl: '', furnitureTypeId: 'biblioteca' },
  { id: 'biblioteca-con-puerta', name: 'Con Puertas Bajas', description: 'Zona alta abierta y zona baja con puertas', imageUrl: '', furnitureTypeId: 'biblioteca' },
  // Camas
  { id: 'cama-plataforma', name: 'Base Plataforma', description: 'Base plana sin cajones, minimalista y moderna', imageUrl: '', furnitureTypeId: 'cama' },
  { id: 'cama-cajones', name: 'Base con Cajones', description: 'Aprovecha el espacio bajo la cama con cajones deslizantes', imageUrl: '', furnitureTypeId: 'cama' },
];

export const MELAMINA_COLORS: MelaminaColor[] = [
  // Neutros
  { id: 'blanco', name: 'Blanco Nieve', hex: '#F8F8F8', category: 'Neutros' },
  { id: 'gris-perla', name: 'Gris Perla', hex: '#D9D9D9', category: 'Neutros' },
  { id: 'gris-oscuro', name: 'Gris Antracita', hex: '#4A4A4A', category: 'Neutros' },
  { id: 'negro', name: 'Negro Grafito', hex: '#1C1C1C', category: 'Neutros' },
  { id: 'crema', name: 'Crema', hex: '#F5ECD7', category: 'Neutros' },
  // Madera
  { id: 'roble-claro', name: 'Roble Claro', hex: '#C8A882', category: 'Madera' },
  { id: 'roble-oscuro', name: 'Roble Oscuro', hex: '#7B5135', category: 'Madera' },
  { id: 'nogal', name: 'Nogal', hex: '#5C3D2E', category: 'Madera' },
  { id: 'pino', name: 'Pino Natural', hex: '#D4A96A', category: 'Madera' },
  { id: 'wengue', name: 'Wengué', hex: '#3B2314', category: 'Madera' },
  { id: 'cedro', name: 'Cedro', hex: '#8B4513', category: 'Madera' },
  // Colores
  { id: 'azul-navy', name: 'Azul Navy', hex: '#1E3A5F', category: 'Colores' },
  { id: 'verde-salvia', name: 'Verde Salvia', hex: '#7C9A7E', category: 'Colores' },
  { id: 'terracota', name: 'Terracota', hex: '#C1603A', category: 'Colores' },
  { id: 'bordo', name: 'Bordo', hex: '#7B1D1D', category: 'Colores' },
];
