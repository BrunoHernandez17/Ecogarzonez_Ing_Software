import React, { useState, useMemo } from 'react';
import { Sparkles, LayoutDashboard, UserCheck, UtensilsCrossed, Smartphone } from 'lucide-react';
import { EventRequest, Menu, Staff, Incidencia, PagoServicio, HonorarioStaff, Client } from './types';
import WizardPortal from './components/WizardPortal';
import AdminDashboard from './components/AdminDashboard';
import SupervisorKanban from './components/SupervisorKanban';
import EmployeeMobile from './components/EmployeeMobile';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'dashboard' | 'supervisor' | 'empleado'>('dashboard');

  // 1. Menús Catalogo (Motor Gastronómico)
  const initialMenus: Menu[] = [
    {
      id: 1,
      nombre: "Cena Ejecutiva Premium",
      descripcion: "Filete de vacuno Angus seleccionado acompañado de papas gratinadas, salsa de hongos y selección de vinos.",
      precioPorPersona: 45.0,
      gramajeBaseDetalles: JSON.stringify([
        { name: "Filete de Vacuno", baseGrammage: 250, unit: "g" },
        { name: "Papas Gratinadas", baseGrammage: 150, unit: "g" },
        { name: "Salsa Champiñón (ml)", baseGrammage: 80, unit: "ml" },
        { name: "Vino Tinto Cabernet", baseGrammage: 150, unit: "ml" },
        { name: "Suspiro Limeño (Postre)", baseGrammage: 120, unit: "g" }
      ])
    },
    {
      id: 2,
      nombre: "Coffee Break Corporativo",
      descripcion: "Café en grano premium molido al instante, acompañamientos dulces y salados, jugos exprimidos de fruta natural.",
      precioPorPersona: 25.0,
      gramajeBaseDetalles: JSON.stringify([
        { name: "Café de Grano", baseGrammage: 15, unit: "g" },
        { name: "Leche Natural (ml)", baseGrammage: 100, unit: "ml" },
        { name: "Tapadito Ave-Pimentón", baseGrammage: 3, unit: "units" },
        { name: "Medialunas Dulces", baseGrammage: 2, unit: "units" },
        { name: "Jugo Naranja Exprimido", baseGrammage: 200, unit: "ml" }
      ])
    }
  ];

  // 2. Fichas de Staff (ms_staff)
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, nombre: "Carlos Gomez", rol: "GARZON", telefono: "+56911223344", email: "cgomez@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 2, nombre: "Ana María Silva", rol: "CHEF", telefono: "+56944556677", email: "amsilva@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 3, nombre: "Mauricio Rojas", rol: "AYUDANTE_COCINA", telefono: "+56988990011", email: "mrojas@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 4, nombre: "Sebastian Soto", rol: "SUPERVISOR", telefono: "+56933445566", email: "ssoto@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 5, nombre: "Patricia Peña", rol: "GARZON", telefono: "+56955667788", email: "ppena@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 6, nombre: "Roberto Diaz", rol: "BARMAN", telefono: "+56977889900", email: "rdiaz@ecogarzones.cl", estado: "DISPONIBLE" },
    { id: 7, nombre: "Jessica Muñoz", rol: "GARZON", telefono: "+56922334455", email: "jmunoz@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 8, nombre: "Daniela Perez", rol: "AYUDANTE_COCINA", telefono: "+56966778899", email: "dperez@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 9, nombre: "Felipe Soto", rol: "BARMAN", telefono: "+56999001122", email: "fsoto@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 10, nombre: "Camila Varas", rol: "GARZON", telefono: "+56912345678", email: "cvaras@ecogarzones.cl", estado: "ASIGNADO" },
    { id: 11, nombre: "Juan Pablo Leiva", rol: "CHEF", telefono: "+56987654321", email: "jpleiva@ecogarzones.cl", estado: "ASIGNADO" }
  ]);

  // 3. Clientes Corporativos (ms_cliente)
  const clientBci: Client = { id: 101, nombre: "Mariana Rojas", nombreEmpresa: "Bci Banco", email: "mrojas@bci.cl", telefono: "+56911223344" };
  const clientGoogle: Client = { id: 102, nombre: "Alberto Smith", nombreEmpresa: "Google Chile", email: "asmith@google.com", telefono: "+56955667788" };
  const clientOracle: Client = { id: 103, nombre: "Catalina Silva", nombreEmpresa: "Oracle Santiago", email: "csilva@oracle.com", telefono: "+56999887766" };

  // 4. Solicitudes de Banquetes (ms_evento)
  const [events, setEvents] = useState<EventRequest[]>([
    {
      id: 1,
      nombre: "Coffee Break Capacitación Bci",
      tipoEvento: "Coffee Break",
      fechaEvento: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      ubicacion: "Huerfanos 1134, Santiago Centro",
      cantidadAsistentes: 150,
      estado: "PLANIFICADO",
      costoEstimado: 3750,
      notas: "Montaje ejecutivo para capacitación técnica. Vajilla eco-friendly.",
      cliente: clientBci,
      menu: initialMenus[1],
      // @ts-ignore
      assignedStaff: {
        SUPERVISOR: ["Sebastian Soto"],
        CHEF: ["Ana María Silva"],
        AYUDANTE_COCINA: ["Mauricio Rojas"],
        GARZON: ["Carlos Gomez", "Patricia Peña"]
      }
    },
    {
      id: 2,
      nombre: "Almuerzo Directorio Google",
      tipoEvento: "Almuerzo",
      fechaEvento: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      ubicacion: "Av. Vitacura 1234, Vitacura",
      cantidadAsistentes: 60,
      estado: "CREADO",
      costoEstimado: 2700,
      notas: "Almuerzo sustentable. Solicitar opciones veganas.",
      cliente: clientGoogle,
      menu: initialMenus[0],
      // @ts-ignore
      assignedStaff: {}
    },
    {
      id: 3,
      nombre: "Cena Gala OCI Launch Oracle",
      tipoEvento: "Cena",
      fechaEvento: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      ubicacion: "WTC Santiago, Las Condes",
      cantidadAsistentes: 80,
      estado: "FINALIZADO",
      costoEstimado: 3600,
      notas: "Cena de gala de OCI Launch.",
      cliente: clientOracle,
      menu: initialMenus[0],
      // @ts-ignore
      assignedStaff: {
        SUPERVISOR: ["Sebastian Soto"],
        CHEF: ["Juan Pablo Leiva"],
        AYUDANTE_COCINA: ["Daniela Perez"],
        GARZON: ["Jessica Muñoz", "Camila Varas"],
        BARMAN: ["Felipe Soto"]
      }
    }
  ]);

  // 5. Historial de Pagos Recibidos (ms_pago_servicio)
  const [payments, setPayments] = useState<PagoServicio[]>([
    { id: 1, eventoId: 1, monto: 3750, fechaPago: new Date().toISOString(), metodoPago: "Transbank Webpay+", transaccionId: "TX_WPY874291", estadoTransaccion: "APROBADO" },
    { id: 2, eventoId: 3, monto: 3600, fechaPago: new Date(Date.now() - 86400000 * 4).toISOString(), metodoPago: "Stripe", transaccionId: "TX_STP902847", estadoTransaccion: "APROBADO" }
  ]);

  // 6. Liquidaciones de Honorarios del Staff (ms_honorario_staff)
  const [payroll, setPayroll] = useState<HonorarioStaff[]>([
    { id: 1, staffId: 1, eventoId: 3, horasTrabajadas: 6.0, tarifaHora: 15, montoTotal: 90.0, estadoPago: "PENDIENTE" },
    { id: 2, staffId: 5, eventoId: 3, horasTrabajadas: 6.0, tarifaHora: 15, montoTotal: 90.0, estadoPago: "LIQUIDADO" },
    { id: 3, staffId: 9, eventoId: 3, horasTrabajadas: 8.0, tarifaHora: 18, montoTotal: 144.0, estadoPago: "PENDIENTE" }
  ]);

  // 7. Bitácora de Incidencias en terreno (incidencia)
  const [incidents, setIncidents] = useState<Incidencia[]>([
    { id: 1, eventId: 3, staffId: 1, staffName: "Carlos Gomez", descripcion: "Rotura de 12 copas de espumante durante el montaje", gravedad: "BAJA", fechaReporte: new Date().toISOString(), resuelta: false },
    { id: 2, eventId: 3, staffId: 4, staffName: "Sebastian Soto", descripcion: "Retraso de 30 minutos del camión de vajilla por tráfico", gravedad: "MEDIA", fechaReporte: new Date().toISOString(), resuelta: true }
  ]);

  // UI Event Handlers
  const handleCreateEvent = (newEvent: Omit<EventRequest, 'id'>, payDetails?: { method: string; transId: string }) => {
    const nextId = Math.max(...events.map(e => e.id), 0) + 1;
    const createdEvent: EventRequest = {
      ...newEvent,
      id: nextId,
      // @ts-ignore
      assignedStaff: {}
    };

    setEvents(prev => [createdEvent, ...prev]);

    // If client paid in the wizard, register billing receipt immediately
    if (payDetails) {
      const newPayment: PagoServicio = {
        id: Math.max(...payments.map(p => p.id), 0) + 1,
        eventoId: nextId,
        monto: newEvent.costoEstimado,
        fechaPago: new Date().toISOString(),
        metodoPago: payDetails.method,
        transaccionId: payDetails.transId,
        estadoTransaccion: "APROBADO"
      };
      setPayments(prev => [newPayment, ...prev]);
    }

    setActiveTab('dashboard');
  };

  const handleUpdateStatus = (id: number, status: EventRequest['estado']) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, estado: status } : e));
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleAssignEmployee = (eventId: number, role: string, employeeName: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      // @ts-ignore
      const currentAssigned = e.assignedStaff || {};
      const roleList = currentAssigned[role] || [];
      return {
        ...e,
        assignedStaff: {
          ...currentAssigned,
          [role]: [...roleList, employeeName]
        }
      };
    }));
  };

  const handleRemoveEmployee = (eventId: number, role: string, employeeName: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      // @ts-ignore
      const currentAssigned = e.assignedStaff || {};
      const roleList = currentAssigned[role] || [];
      return {
        ...e,
        assignedStaff: {
          ...currentAssigned,
          [role]: roleList.filter(name => name !== employeeName)
        }
      };
    }));
  };

  // Staff mobile trigger registrations
  const handleConfirmAvailability = (employeeName: string, confirmed: boolean) => {
    console.log(`Disponibilidad de ${employeeName}: ${confirmed}`);
  };

  const handleConfirmTransfer = (employeeName: string, confirmed: boolean) => {
    console.log(`Traslado de ${employeeName}: ${confirmed}`);
  };

  const handleClockInOut = (employeeName: string, type: 'in' | 'out') => {
    const emp = staff.find(s => s.nombre === employeeName);
    if (!emp) return;

    if (type === 'out') {
      // Upon check-out, generate payroll receipt automatically (Billing & Fees integration)
      const hourlyRate = emp.rol === 'CHEF' ? 22 : emp.rol === 'SUPERVISOR' ? 25 : emp.rol === 'BARMAN' ? 18 : 15;
      const hours = 5.5; // Simulated worked hours
      const newFee: HonorarioStaff = {
        id: Math.max(...payroll.map(p => p.id), 0) + 1,
        staffId: emp.id,
        eventoId: 1,
        horasTrabajadas: hours,
        tarifaHora: hourlyRate,
        montoTotal: hours * hourlyRate,
        estadoPago: "PENDIENTE"
      };
      setPayroll(prev => [newFee, ...prev]);
    }
  };

  const handleReportIncident = (incident: { description: string; severity: 'BAJA' | 'MEDIA' | 'ALTA'; staffName: string }) => {
    const reporter = staff.find(s => s.nombre === incident.staffName);
    const newInc: Incidencia = {
      id: Math.max(...incidents.map(i => i.id), 0) + 1,
      eventId: 1, // Simulated active event ID
      staffId: reporter ? reporter.id : 1,
      staffName: incident.staffName,
      descripcion: incident.description,
      gravedad: incident.severity,
      fechaReporte: new Date().toISOString(),
      resuelta: false
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleResolveIncident = (id: number) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, resuelta: true } : i));
  };

  const handlePayStaff = (id: number) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, estadoPago: "LIQUIDADO" } : p));
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 font-sans antialiased pb-20 selection:bg-emerald-950 selection:text-emerald-400">
      
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-900 px-6 sm:px-8 flex items-center justify-between sticky top-0 bg-[#060a13]/90 backdrop-blur-md z-45">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/20">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white leading-none">Ecogarzones</span>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-1 uppercase font-bold">Banquetes OCI Cloud</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full text-[10px]">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="uppercase font-bold tracking-widest font-mono text-slate-400">OCI Cloud - Activo</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10 border-b border-slate-900 pb-5">
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'portal'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Portal Web Cliente
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Panel Administrador
          </button>

          <button
            onClick={() => setActiveTab('supervisor')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'supervisor'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Panel de Operaciones
          </button>

          <button
            onClick={() => setActiveTab('empleado')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'empleado'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" /> App Móvil Staff
          </button>
        </div>

        {/* Views Router */}
        <div>
          {activeTab === 'portal' && (
            <WizardPortal
              menus={initialMenus}
              onSubmit={handleCreateEvent}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'dashboard' && (
            <AdminDashboard
              events={events}
              menus={initialMenus}
              staff={staff}
              incidents={incidents}
              payments={payments}
              payroll={payroll}
              onUpdateStatus={handleUpdateStatus}
              onDeleteEvent={handleDeleteEvent}
              onResolveIncident={handleResolveIncident}
              onPayStaff={handlePayStaff}
              onNavigateToSupervisor={() => setActiveTab('supervisor')}
            />
          )}

          {activeTab === 'supervisor' && (
            <SupervisorKanban
              events={events}
              employees={staff}
              onUpdateStatus={handleUpdateStatus}
              onAssignEmployee={handleAssignEmployee}
              onRemoveEmployee={handleRemoveEmployee}
            />
          )}

          {activeTab === 'empleado' && (
            <EmployeeMobile
              events={events}
              employees={staff}
              onConfirmAvailability={handleConfirmAvailability}
              onConfirmTransfer={handleConfirmTransfer}
              onClockInOut={handleClockInOut}
              onReportIncident={handleReportIncident}
            />
          )}
        </div>

      </main>
    </div>
  );
}
