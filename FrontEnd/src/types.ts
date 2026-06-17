export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  createdAt: string;
  dueDate?: string;
}

export interface Client {
  id: number;
  nombre: string;
  nombreEmpresa: string;
  email: string;
  telefono: string;
}

export interface Menu {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorPersona: number;
  gramajeBaseDetalles: string;
}

export interface EventRequest {
  id: number;
  nombre: string;
  tipoEvento: 'Cena' | 'Almuerzo' | 'Coffee Break' | 'Coctel';
  fechaEvento: string;
  ubicacion: string;
  cantidadAsistentes: number;
  estado: 'CREADO' | 'PLANIFICADO' | 'EN_EJECUCION' | 'FINALIZADO';
  costoEstimado: number;
  notas?: string;
  cliente: Client;
  menu: Menu;
}

export interface PagoServicio {
  id: number;
  eventoId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  transaccionId: string;
  estadoTransaccion: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE';
}

export interface HonorarioStaff {
  id: number;
  staffId: number;
  eventoId: number;
  horasTrabajadas: number;
  tarifaHora: number;
  montoTotal: number;
  estadoPago: 'LIQUIDADO' | 'PENDIENTE' | 'EN_PROCESO';
}

export interface Staff {
  id: number;
  nombre: string;
  rol: 'SUPERVISOR' | 'CHEF' | 'AYUDANTE_COCINA' | 'GARZON' | 'BARMAN';
  telefono: string;
  email: string;
  estado: 'DISPONIBLE' | 'ASIGNADO' | 'NO_DISPONIBLE';
}

export interface AsignacionStaff {
  id: number;
  staff: Staff;
  eventId: number;
  rolAsignado: string;
  confirmarDisponibilidad: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  trasladoConfirmado: boolean;
}

export interface Incidencia {
  id: number;
  eventId: number;
  staffId: number;
  staffName: string;
  descripcion: string;
  gravedad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaReporte: string;
  resuelta: boolean;
}

export interface Documento {
  id: number;
  eventId: number;
  tipoDocumento: 'CONTRATO' | 'GUIA_DESPACHO' | 'FACTURA';
  archivoUrl: string;
  fechaGeneracion: string;
}

export interface PredictiveReport {
  eventType: string;
  simulatedEventsCount: number;
  totalExpectedGuests: number;
  projectedIngredients: Record<string, number>;
  requiredStaffTotal: number;
  estimatedOperationCost: number;
  predictedRevenue: number;
}
