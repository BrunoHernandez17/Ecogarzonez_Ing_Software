import React, { useState, useMemo } from 'react';
import { DollarSign, BarChart2, Inbox, Activity, Users, Utensils, Check, Eye, Trash2, ArrowRight, ShieldAlert, Package, Layers, RefreshCw } from 'lucide-react';
import { EventRequest, Menu, Staff, Incidencia, PagoServicio, HonorarioStaff } from '../types';

interface AdminDashboardProps {
  events: EventRequest[];
  menus: Menu[];
  staff: Staff[];
  incidents: Incidencia[];
  payments: PagoServicio[];
  payroll: HonorarioStaff[];
  onUpdateStatus: (id: number, status: EventRequest['estado']) => void;
  onDeleteEvent: (id: number) => void;
  onResolveIncident: (id: number) => void;
  onPayStaff: (id: number) => void;
  onNavigateToSupervisor: () => void;
}

export default function AdminDashboard({
  events,
  menus,
  staff,
  incidents,
  payments,
  payroll,
  onUpdateStatus,
  onDeleteEvent,
  onResolveIncident,
  onPayStaff,
  onNavigateToSupervisor
}: AdminDashboardProps) {
  const [selectedCalcEvent, setSelectedCalcEvent] = useState<EventRequest | null>(null);
  const [currentSubTab, setCurrentSubTab] = useState<'solicitudes' | 'nomina' | 'inventario' | 'predictivo'>('solicitudes');

  // Predictive state
  const [predictiveType, setPredictiveType] = useState('Cena');
  const [predictiveEvents, setPredictiveEvents] = useState(5);
  const [predictiveReport, setPredictiveReport] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);

  // 1. KPIs Consolidados
  const kpis = useMemo(() => {
    const revenue = events.reduce((acc, curr) => acc + curr.costoEstimado, 0);
    const pending = events.filter(e => e.estado === 'CREADO').length;
    const active = events.filter(e => e.estado === 'PLANIFICADO' || e.estado === 'EN_EJECUCION').length;
    const activeIncidents = incidents.filter(i => !i.resuelta).length;

    return {
      revenue,
      eventsCount: events.length,
      pendingCount: pending,
      activeCount: active,
      incidentsCount: activeIncidents
    };
  }, [events, incidents]);

  // Inventory list
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Copas de Cristal Champagne', cant: 1200, cat: 'Cristalería', unit: 'unidades' },
    { id: 2, item: 'Vajilla Redonda Porcelana', cant: 800, cat: 'Vajilla', unit: 'unidades' },
    { id: 3, item: 'Manteles Lino Crudo 3x3', cant: 150, cat: 'Mantelería', unit: 'unidades' },
    { id: 4, item: 'Cubiertos Acero Inox (Juego)', cant: 1000, cat: 'Vajilla', unit: 'sets' },
    { id: 5, item: 'Mesas Redondas Plegables', cant: 120, cat: 'Equipamiento', unit: 'unidades' },
    { id: 6, item: 'Hornos Convectores Eléctricos', cant: 4, cat: 'Equipamiento', unit: 'unidades' }
  ]);

  // Portions math
  const modalIngredients = useMemo(() => {
    if (!selectedCalcEvent) return [];
    const menu = selectedCalcEvent.menu;
    if (!menu || !menu.gramajeBaseDetalles) return [];
    try {
      const items = JSON.parse(menu.gramajeBaseDetalles);
      return items.map((ing: any) => {
        const total = ing.baseGrammage * selectedCalcEvent.cantidadAsistentes * 1.10; // +10% waste safety margin
        let displayQuantity = total;
        let unit = ing.unit;
        
        if (ing.unit === 'g' && total >= 1000) {
          displayQuantity = total / 1000;
          unit = 'kg';
        } else if (ing.unit === 'ml' && total >= 1000) {
          displayQuantity = total / 1000;
          unit = 'L';
        }

        return {
          name: ing.name,
          quantity: Math.round(displayQuantity * 100) / 100,
          unit
        };
      });
    } catch (e) {
      return [];
    }
  }, [selectedCalcEvent]);

  // Trigger simulated OCI Redis-cached predictive analysis
  const runPrediction = () => {
    setLoadingPrediction(true);
    // Simulate cache retrieval
    setTimeout(() => {
      setLoadingPrediction(false);
      setCacheHit(predictiveReport !== null && predictiveReport.type === predictiveType && predictiveReport.events === predictiveEvents);
      
      const avgGuests = predictiveType === 'Cena' ? 120 : 85;
      const guests = avgGuests * predictiveEvents;
      
      const ingredients: Record<string, number> = {};
      if (predictiveType === 'Cena') {
        ingredients['Corte de Vacuno (Filete)'] = guests * 0.250;
        ingredients['Papas del Huerto'] = guests * 0.150;
        ingredients['Vino Reservado (L)'] = guests * 0.150;
      } else {
        ingredients['Granos de Café Tostados'] = guests * 0.015;
        ingredients['Leche Natural (L)'] = guests * 0.100;
        ingredients['Bocadillos Surtidos'] = guests * 5;
      }

      setPredictiveReport({
        type: predictiveType,
        events: predictiveEvents,
        guests,
        ingredients,
        staff: Math.ceil(guests / 15) + Math.ceil(guests / 40) + predictiveEvents,
        cost: guests * (predictiveType === 'Cena' ? 45 : 25),
        revenue: guests * (predictiveType === 'Cena' ? 45 : 25) * 1.35
      });
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monto Total Facturado</span>
          <div className="text-2xl font-black text-white mt-2 font-mono">${kpis.revenue.toLocaleString()} USD</div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Pagos validados mediante Transbank
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Eventos Totales</span>
          <div className="text-2xl font-black text-white mt-2 font-mono">{kpis.eventsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1.5">{kpis.activeCount} activos en operaciones</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15">
            <Inbox className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Solicitudes por Validar</span>
          <div className="text-2xl font-black text-white mt-2 font-mono">{kpis.pendingCount}</div>
          <div className="text-[10px] text-slate-500 mt-1.5">Requieren aprobación comercial</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Incidencias Activas</span>
          <div className="text-2xl font-black text-rose-500 mt-2 font-mono">{kpis.incidentsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1.5">Reportadas por staff en terreno</div>
        </div>
      </div>

      {/* Incidents Alert Box */}
      {incidents.filter(i => !i.resuelta).length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
            Alerta Logística: Incidencias reportadas en terreno
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incidents.filter(i => !i.resuelta).map(inc => (
              <div key={inc.id} className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-rose-400 font-bold uppercase text-[9px] bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-900/30 mr-1.5">
                    {inc.gravedad}
                  </span>
                  <span className="text-slate-300 font-medium">{inc.descripcion}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Reportado por: {inc.staffName}</div>
                </div>
                <button
                  onClick={() => onResolveIncident(inc.id)}
                  className="px-2.5 py-1 bg-rose-900/40 hover:bg-rose-900 text-rose-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                >
                  Resolver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tabs Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Sub Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setCurrentSubTab('solicitudes')}
            className={`px-5 py-4 border-r border-slate-800 cursor-pointer transition-all ${
              currentSubTab === 'solicitudes' ? 'bg-slate-900 text-emerald-400 border-t-2 border-t-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solicitudes Clientes
          </button>
          
          <button
            onClick={() => setCurrentSubTab('nomina')}
            className={`px-5 py-4 border-r border-slate-800 cursor-pointer transition-all ${
              currentSubTab === 'nomina' ? 'bg-slate-900 text-emerald-400 border-t-2 border-t-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nómina de Pagos Staff
          </button>

          <button
            onClick={() => setCurrentSubTab('inventario')}
            className={`px-5 py-4 border-r border-slate-800 cursor-pointer transition-all ${
              currentSubTab === 'inventario' ? 'bg-slate-900 text-emerald-400 border-t-2 border-t-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Control de Inventario
          </button>

          <button
            onClick={() => setCurrentSubTab('predictivo')}
            className={`px-5 py-4 cursor-pointer transition-all ${
              currentSubTab === 'predictivo' ? 'bg-slate-900 text-emerald-400 border-t-2 border-t-emerald-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IA Predictiva (Redis)
          </button>
        </div>

        {/* Sub Tab Contents */}
        <div className="p-6">
          
          {/* Sub Tab: Requests */}
          {currentSubTab === 'solicitudes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aprobación de Banquetes Cotizados</h4>
                <span className="text-xs bg-slate-950 px-2.5 py-0.5 rounded-full font-mono text-emerald-400 border border-slate-850">
                  {events.filter(e => e.estado === 'CREADO').length} nuevas solicitudes
                </span>
              </div>

              {events.filter(e => e.estado === 'CREADO').length === 0 ? (
                <div className="text-center py-12 bg-slate-950/30 border border-dashed border-slate-850 rounded-xl">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Sin solicitudes pendientes</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Todos los banquetes han sido pagados y planificados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.filter(e => e.estado === 'CREADO').map(event => (
                    <div
                      key={event.id}
                      className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{event.nombre}</span>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            {event.tipoEvento}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Empresa: <span className="text-slate-300 font-bold">{event.cliente.nombreEmpresa}</span> • Fecha: <span className="font-mono text-slate-300">{event.fechaEvento}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Ubicación: {event.ubicacion} • Asistentes: {event.cantidadAsistentes}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => setSelectedCalcEvent(event)}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Insumos
                        </button>
                        
                        <button
                          onClick={() => onUpdateStatus(event.id, 'PLANIFICADO')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-emerald-950/20"
                        >
                          <Check className="w-3.5 h-3.5" /> Aprobar y Planificar
                        </button>

                        <button
                          onClick={() => onDeleteEvent(event.id)}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-red-950 hover:text-red-400 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub Tab: Payroll */}
          {currentSubTab === 'nomina' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Nómina de Honorarios y Liquidaciones</h4>
                <span className="text-xs text-slate-500">Horas registradas mediante check-in móvil</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-3">ID Turno</th>
                      <th className="pb-3">Colaborador</th>
                      <th className="pb-3">Rol</th>
                      <th className="pb-3 text-center">Horas</th>
                      <th className="pb-3 text-right">Tarifa/Hr</th>
                      <th className="pb-3 text-right">Monto Total</th>
                      <th className="pb-3 text-center">Estado</th>
                      <th className="pb-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {payroll.map(item => {
                      const emp = staff.find(s => s.id === item.staffId);
                      return (
                        <tr key={item.id} className="text-slate-300">
                          <td className="py-3.5">#TRN_{item.id}</td>
                          <td className="py-3.5 font-bold text-white">{emp ? emp.nombre : 'Staff ID ' + item.staffId}</td>
                          <td className="py-3.5">{emp ? emp.rol.replace('_', ' ') : 'N/A'}</td>
                          <td className="py-3.5 text-center">{item.horasTrabajadas} hrs</td>
                          <td className="py-3.5 text-right">${item.tarifaHora} USD</td>
                          <td className="py-3.5 text-right text-emerald-400 font-bold">${item.montoTotal} USD</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.estadoPago === 'LIQUIDADO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950 text-amber-400 border border-amber-900/30'
                            }`}>
                              {item.estadoPago}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {item.estadoPago !== 'LIQUIDADO' ? (
                              <button
                                onClick={() => onPayStaff(item.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold cursor-pointer transition-all"
                              >
                                Pagar
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500">Liquidado ✓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab: Inventory */}
          {currentSubTab === 'inventario' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Inventario Logístico Físico</h4>
                <span className="text-xs text-slate-500">Vajilla, mantelería y equipamiento</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inventory.map(item => (
                  <div key={item.id} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.cat}</div>
                      <h5 className="text-xs font-bold text-white mt-1">{item.item}</h5>
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Unidad: {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-400 font-mono">{item.cant}</div>
                      <span className="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">En Stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: Predictive IA */}
          {currentSubTab === 'predictivo' && (
            <div className="space-y-6">
              <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="text-emerald-500 w-4 h-4" />
                  Motor de Proyecciones de Insumos (Caché Redis / AWS-First)
                </h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Simula la planificación a futuro de un volumen de eventos para calcular en caché la compra óptima de insumos y evitar quiebres de stock.
                </p>

                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Tipo de Evento</label>
                    <select
                      value={predictiveType}
                      onChange={(e) => setPredictiveType(e.target.value)}
                      className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="Cena">Cenas de Gala</option>
                      <option value="Coffee Break">Coffee Breaks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Eventos Proyectados</label>
                    <input
                      type="number"
                      min="1"
                      value={predictiveEvents}
                      onChange={(e) => setPredictiveEvents(Math.max(1, parseInt(e.target.value) || 0))}
                      className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none w-24"
                    />
                  </div>

                  <button
                    onClick={runPrediction}
                    disabled={loadingPrediction}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingPrediction ? 'animate-spin' : ''}`} />
                    Ejecutar Algoritmo
                  </button>
                </div>
              </div>

              {predictiveReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                  {/* Results metrics */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Reporte de Proyección Predictiva</h5>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        cacheHit ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {cacheHit ? 'CACHE HIT (Redis)' : 'CALCULATION COMPLETE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        <span className="text-slate-500 text-[9px] block">Invitados Proyectados</span>
                        <span className="text-white font-bold">{predictiveReport.guests} personas</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        <span className="text-slate-500 text-[9px] block">Dotación Staff Sugerido</span>
                        <span className="text-white font-bold">{predictiveReport.staff} profesionales</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        <span className="text-slate-500 text-[9px] block">Costo Operativo Proyectado</span>
                        <span className="text-white font-bold">${predictiveReport.cost.toLocaleString()} USD</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        <span className="text-slate-500 text-[9px] block">Ingresos Proyectados</span>
                        <span className="text-emerald-400 font-bold">${predictiveReport.revenue.toLocaleString()} USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Projected stock ingredients list */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Insumos Críticos Requeridos (Orden de Compra Proyectada)</h5>
                    <div className="divide-y divide-slate-900 font-mono text-xs text-slate-400">
                      {Object.entries(predictiveReport.ingredients).map(([name, qty]: any) => (
                        <div key={name} className="py-2.5 flex justify-between">
                          <span>• {name}</span>
                          <span className="text-emerald-400 font-bold">
                            {qty.toLocaleString()} {predictiveType === 'Cena' && !name.includes('L') ? 'kg' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Portions calculation modal */}
      {selectedCalcEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h4 className="text-base font-bold text-white">Cálculo de Insumos Gastronómicos</h4>
                <p className="text-xs text-slate-400">{selectedCalcEvent.nombre} - {selectedCalcEvent.cantidadAsistentes} invitados</p>
              </div>
              <button
                onClick={() => setSelectedCalcEvent(null)}
                className="text-slate-400 hover:text-white font-bold text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-850/80 space-y-3.5 max-h-80 overflow-y-auto font-mono">
              <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2 flex justify-between">
                <span>Ingrediente</span>
                <span>Cantidad Proyectada (+10% Merma)</span>
              </div>
              {modalIngredients.map((ing, idx) => (
                <div key={idx} className="flex justify-between text-slate-400">
                  <span>• {ing.name}</span>
                  <span className="text-slate-200 font-bold">{ing.quantity} {ing.unit}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 text-[11px] text-slate-500 italic">
              * Nota: Cálculos generados por CalculadorInsumosService según la receta base.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
