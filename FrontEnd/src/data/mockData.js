// Mock Data for Ecogarzones - Banquetería e Hitos de Gestión de Eventos

export const EVENT_TYPES = [
  { id: 'matrimonio', name: 'Matrimonio', basePrice: 450000 },
  { id: 'corporativo', name: 'Evento Corporativo', basePrice: 600000 },
  { id: 'gala', name: 'Cena de Gala', basePrice: 800000 },
  { id: 'cumpleanos', name: 'Cumpleaños Premium', basePrice: 300000 },
  { id: 'coctel', name: 'Cóctel de Lanzamiento', basePrice: 500000 }
];

export const FOOD_MENUS = [
  {
    id: 'tradicional',
    name: 'Menú Tradicional del Valle',
    description: 'Sabores autóctonos con cortes de carne premium y pescados finos de la costa chilena.',
    pricePerPerson: 42000,
    items: {
      entrada: 'Ceviche de reineta y camarón patagónico con tostadas al ajo.',
      fondo: 'Plateada al horno de cocción lenta sobre pastelera de choclo aromatizada con albahaca.',
      postre: 'Mousse de mote con huesillo y crocante de merengue.'
    }
  },
  {
    id: 'costera',
    name: 'Menú Costera Pacífico',
    description: 'Banquete marino premium con mariscos y pescados frescos seleccionados de nuestras caletas.',
    pricePerPerson: 48000,
    items: {
      entrada: 'Ceviche de pulpo y centolla magallánica aromatizado con cilantro y limón de pica.',
      fondo: 'Salmón del sur en costra de hierbas finas acompañado de puré rústico de habas y espárragos.',
      postre: 'Crumble de frutos del bosque patagónicos con crema batida al pisco.'
    }
  },
  {
    id: 'campestre',
    name: 'Menú Campestre Criollo',
    description: 'Una reinterpretación gourmet de la cocina campestre tradicional de las haciendas del sur.',
    pricePerPerson: 35000,
    items: {
      entrada: 'Empanaditas horneadas de pino de wagyu y queso de cabra con pebre de ají amarillo.',
      fondo: 'Costillar de cerdo laqueado en miel de ulmo y merken con papines salteados al romero.',
      postre: 'Leche asada casera con salsa de caramelo al ron.'
    }
  },
  {
    id: 'nikkei',
    name: 'Menú Fusión Nikkei',
    description: 'Elegante propuesta que une el rigor técnico japonés con la sazón y frescura peruano-chilena.',
    pricePerPerson: 52000,
    items: {
      entrada: 'Tiradito de atún aleta amarilla en salsa de ají amarillo, maracuyá y chips de camote.',
      fondo: 'Filete de res Angus salteado al wok con cebolla morada, tomates cherry, soya y arroz chaufa al sésamo.',
      postre: 'Mousse de maracuyá con base de galletas de jengibre y coco rallado.'
    }
  },
  {
    id: 'vegano',
    name: 'Menú Vegano del Huerto',
    description: 'Gastronomía 100% basada en plantas con ingredientes orgánicos y de cultivo local.',
    pricePerPerson: 38000,
    items: {
      entrada: 'Carpaccio de betarragas asadas con rúcula, nueces tostadas y vinagreta de frutos rojos.',
      fondo: 'Risotto de champiñones silvestres y setas portobello con queso de almendras y aceite de trufa.',
      postre: 'Crumble de manzanas del sur con helado vegano de vainilla de Madagascar.'
    }
  },
  {
    id: 'vegetariano',
    name: 'Menú Vegetariano Armonía',
    description: 'Exquisita fusión de quesos artesanales, vegetales grillados y pastas hechas a mano.',
    pricePerPerson: 39000,
    items: {
      entrada: 'Cremoso de cabra grillado sobre mix de hojas verdes, higos caramelizados y aderezo balsámico.',
      fondo: 'Sorrentinos rellenos de calabaza asada y queso azul en salsa de nueces y salvia.',
      postre: 'Volcán de chocolate belga con helado artesanal de pistacho.'
    }
  },
  {
    id: 'singluten',
    name: 'Menú Gluten Free Cuidado',
    description: 'Alternativa premium libre de gluten certificada, sin comprometer el sabor ni la presentación.',
    pricePerPerson: 44000,
    items: {
      entrada: 'Tártaro de salmón atlántico con palta hass, alcaparras y aderezo cítrico sin gluten.',
      fondo: 'Filete de res premium a la plancha en salsa de vino Carménère con papas rústicas al romero.',
      postre: 'Suspiro limeño tradicional con merengue al oporto gluten-free.'
    }
  }
];

export const BAR_OPTIONS = [
  {
    id: 'bar_abierto',
    name: 'Bar Abierto Tradicional',
    description: 'Pisco sour nacional, cervezas seleccionadas, bebidas y vinos tintos y blancos de reserva.',
    pricePerPerson: 18000
  },
  {
    id: 'cocteleria_autor',
    name: 'Coctelería de Autor Premium',
    description: 'Tragos diseñados por nuestro mixólogo estrella (Terremoto de autor, Gin tonic con botánicos chilenos, Pisco Sour premium de pisco envejecido, y licores importados).',
    pricePerPerson: 25000
  },
  {
    id: 'wine_tour',
    name: 'Bar Abierto Premium Wine Tour',
    description: 'Experiencia enológica premium con cata de vinos tintos y blancos Gran Reserva de valles chilenos (Casablanca, Colchagua, Maipo) guiada por garzones certificados.',
    pricePerPerson: 30000
  },
  {
    id: 'cervezas_artesanales',
    name: 'Barra Cervecerías Artesanales Chilenas',
    description: 'Selección de cervezas de barril tiradas en frío (Pale Ale, IPA, Stout) de productoras de Valdivia, Valparaíso y Quilpué, acompañadas de frutos secos especiados.',
    pricePerPerson: 15000
  },
  {
    id: 'sin_alcohol',
    name: 'Bar Libre Sin Alcohol (Mocktails)',
    description: 'Jugos naturales exprimidos en el momento, limonadas de albahaca-jengibre, mojito virgen y tónicas saborizadas.',
    pricePerPerson: 12000
  }
];

export const STAFF_MEMBERS = [
  // Garzones
  { id: 1, name: 'Ignacio Valenzuela', role: 'Garzón', status: 'Disponible' },
  { id: 2, name: 'Valentina Soto', role: 'Garzón', status: 'Disponible' },
  { id: 3, name: 'Matías Muñoz', role: 'Garzón', status: 'Disponible' },
  { id: 4, name: 'Camila Rojas', role: 'Garzón', status: 'Asignado' },
  { id: 5, name: 'Sebastián Pizarro', role: 'Garzón', status: 'Disponible' },
  { id: 6, name: 'Sofía Contreras', role: 'Garzón', status: 'Asignado' },
  { id: 7, name: 'Diego Morales', role: 'Garzón', status: 'Disponible' },
  { id: 8, name: 'Francisca Lagos', role: 'Garzón', status: 'Disponible' },
  
  // Cocineros
  { id: 9, name: 'Chef Pedro Uribe', role: 'Cocinero (Jefe)', status: 'Asignado' },
  { id: 10, name: 'Esteban Araya', role: 'Cocinero', status: 'Disponible' },
  { id: 11, name: 'Mariana Henríquez', role: 'Cocinero', status: 'Asignado' },
  { id: 12, name: 'Andrés Olivares', role: 'Cocinero', status: 'Disponible' },
  
  // Limpieza
  { id: 13, name: 'Rosa Espinoza', role: 'Limpieza', status: 'Disponible' },
  { id: 14, name: 'Héctor Tapia', role: 'Limpieza', status: 'Asignado' }
];

export const INITIAL_EVENTS = [
  {
    id: 'EVT-001',
    clientName: 'Banco de Chile - Cena Anual',
    clientEmail: 'contacto@bancochile.cl',
    eventType: 'corporativo',
    date: '2026-07-15',
    guests: 120,
    menuId: 'tradicional',
    barId: 'cocteleria_autor',
    totalPrice: 8640000, // (42000 + 25000) * 120 + 600000 base
    cost: 5184000, // 60% aprox
    status: 'Pendiente',
    createdAt: '2026-06-28',
    assignedStaff: []
  },
  {
    id: 'EVT-002',
    clientName: 'Matrimonio Silva - Valenzuela',
    clientEmail: 'javiera.silva@gmail.com',
    eventType: 'matrimonio',
    date: '2026-08-05',
    guests: 200,
    menuId: 'singluten',
    barId: 'bar_abierto',
    totalPrice: 12850000, // (44000 + 18000) * 200 + 450000 base
    cost: 7200000,
    status: 'Aprobado',
    createdAt: '2026-06-25',
    assignedStaff: [4, 6, 9, 11, 14] // IDs de personal asignado
  },
  {
    id: 'EVT-003',
    clientName: 'Cochilco - Lanzamiento Memoria',
    clientEmail: 'info@cochilco.cl',
    eventType: 'corporativo',
    date: '2026-07-22',
    guests: 60,
    menuId: 'vegetariano',
    barId: 'sin_alcohol',
    totalPrice: 3660000, // (39000 + 12000) * 60 + 600000 base
    cost: 2100000,
    status: 'Aprobado',
    createdAt: '2026-06-29',
    assignedStaff: []
  },
  {
    id: 'EVT-004',
    clientName: 'Cumpleaños 50 Rodolfo Vergara',
    clientEmail: 'rvergara@outlook.com',
    eventType: 'cumpleanos',
    date: '2026-09-12',
    guests: 45,
    menuId: 'vegano',
    barId: 'cocteleria_autor',
    totalPrice: 3135000, // (38000 + 25000) * 45 + 300000 base
    cost: 1880000,
    status: 'Rechazado',
    createdAt: '2026-06-20',
    assignedStaff: []
  }
];

export const formatCLP = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};
