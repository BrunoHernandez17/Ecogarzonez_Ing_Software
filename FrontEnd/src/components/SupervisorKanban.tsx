import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Play, CheckCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { EventRequest, Staff } from '../types';

interface SupervisorKanbanProps {
  events: EventRequest[];
  employees: Staff[];
  onUpdateStatus: (id: number, status: EventRequest['estado']) => void;
  onAssignEmployee: (eventId: number, role: string, employeeName: string) => void;
  onRemoveEmployee: (eventId: number, role: string, employeeName: string) => void;
}

export default function SupervisorKanban({
  events,
  employees,
  onUpdateStatus,
  onAssignEmployee,
  onRemoveEmployee
}: SupervisorKanbanProps) {
  const planificables = useMemo(() => {
    return events.filter(e => e.estado === 'PLANIFICADO' || e.estado === 'EN_EJECUCION');
  }, [events]);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    planificables.length > 0 ? planificables[0].id : null
  );

  const selectedEvent = useMemo(() => {
    return planificables.find(e => e.id === selectedEventId) || null;
  }, [planificables, selectedEventId]);

  const requiredCounts = useMemo(() => {
    if (!selectedEvent) return { SUPERVISOR: 0, CHEF: 0, AYUDANTE_COCINA: 0, GARZON: 0, BARMAN: 0 };
    const guests = selectedEvent.cantidadAsistentes;
    const garzones = Math.ceil(guests / 15);
    const chefs = Math.ceil(guests / 40);
    const ayudantes = Math.ceil(guests / 30);
    const supervisors = 1;
    const barmen = (selectedEvent.tipoEvento === 'Cena' || selectedEvent.tipoEvento === 'Coctel') ? Math.ceil(guests / 50) : 0;

    return {
      SUPERVISOR: supervisors,
      CHEF: chefs,
      AYUDANTE_COCINA: ayudantes,
      GARZON: garzones,
      BARMAN: barmen
    };
  }, [selectedEvent]);

  // Read assigned staff names from local simulation
  // In the App.tsx we keep an object map or inside EventRequest assignedStaff record.
  // We will write App.tsx to use event.assignedStaff = { 'GARZON': ['Carlos Gomez'] }
  const assignedList = useMemo(() => {
    if (!selectedEvent) return {};
    // @ts-ignore
    return selectedEvent.assignedStaff || {};
  }, [selectedEvent]);

  const getAvailableEmployeesForRole = (role: Staff['rol']) => {
    const currentEventAssigned = Object.values(assignedList).flat();
    return employees.filter(emp => emp.rol === role && !currentEventAssigned.includes(emp.nombre));
  };

  const handleAssign = (role: string, name: string) => {
    if (!selectedEvent) return;
    const currentAssigned = assignedList[role] || [];
    const limit = requiredCounts[role as keyof typeof requiredCounts] || 0;
    
    if (currentAssigned.length >= limit) {
      alert(`Cupo de ${role} completo para este evento.`);
      return;
    }
    onAssignEmployee(selectedEvent.id, role, name);
  };

  const handleRemove = (role: string, name: string) => {
    if (!selectedEvent) return;
    onRemoveEmployee(selectedEvent.id, role, name);
  };

  const handleStartEvent = () => {
    if (!selectedEvent) return;
    let totalReq = 0;
    let totalAsig = 0;
    Object.entries(requiredCounts).forEach(([role, req]) => {
      totalReq += req as number;
      totalAsig += (assignedList[role] || []).length;
    });

    if (totalAsig < totalReq * 0.8) {
      if (!confirm('La dotación de personal asignado es baja (menor al 80%). ¿Deseas iniciar el turno de todas formas?')) {
        return;
      }
    }

    onUpdateStatus(selectedEvent.id, 'EN_EJECUCION');
  };

  const handleFinalizeEvent = () => {
    if (!selectedEvent) return;
    onUpdateStatus(selectedEvent.id, 'FINALIZADO');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Event Selection Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Panel de Asignación Logística (Supervisor)
          </h3>
          <p className="text-xs text-slate-400 mt-1">Asigna personal calificado a turnos de banquetes corporativos.</p>
        </div>

        {planificables.length > 0 && (
          <div className="flex items-center gap-2.5">
            <label className="text-xs text-slate-400 font-bold uppercase">Seleccionar Evento:</label>
            <select
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
              className="bg-slate-950 border border-slate-850 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {planificables.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre} ({e.tipoEvento} - {e.fechaEvento})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {planificables.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-300">No hay eventos para planificar</h4>
          <p className="text-xs text-slate-500 mt-1">Configure cotizaciones en el Portal Web Cliente para habilitarlas aquí.</p>
        </div>
      ) : selectedEvent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Drag/Click Lanes */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Planificación de Turnos: {selectedEvent.nombre}</h4>
                  <div className="text-xs text-slate-400 mt-1">
                    Dirección: <span className="text-slate-300 font-medium">{selectedEvent.ubicacion}</span> • Invitados: <span className="text-slate-300 font-bold">{selectedEvent.cantidadAsistentes}</span>
                  </div>
                </div>

                {selectedEvent.estado === 'PLANIFICADO' ? (
                  <button
                    onClick={handleStartEvent}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Iniciar Evento
                  </button>
                ) : (
                  <button
                    onClick={handleFinalizeEvent}
                    className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-emerald-400 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Finalizar Turno
                  </button>
                )}
              </div>

              {/* Kanban Lanes */}
                {Object.entries(requiredCounts).map(([role, limitVal]) => {
                  const limit = limitVal as number;
                  if (limit === 0) return null;
                  const assigned = assignedList[role] || [];
                  const progressPct = Math.min(100, Math.round((assigned.length / limit) * 100));

                  return (
                    <div key={role} className="bg-slate-955 border border-slate-850 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300 tracking-wide">{role.replace('_', ' ')}s</span>
                        <span className={`font-mono font-bold ${assigned.length === limit ? 'text-emerald-400' : 'text-slate-450'}`}>
                          {assigned.length} / {limit} asignados
                        </span>
                      </div>
                      
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${assigned.length === limit ? 'bg-emerald-400' : 'bg-amber-500'}`} style={{ width: `${progressPct}%` }} />
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {assigned.map((name, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleRemove(role, name)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-red-400 hover:border-red-950 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all hover:bg-red-950/10"
                            title="Haz clic para desasignar"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {name}
                            <span className="text-[10px] text-slate-500 hover:text-red-450 font-bold">&times;</span>
                          </span>
                        ))}

                        {assigned.length < limit && (
                          <span className="border border-dashed border-slate-800 text-slate-500 px-3 py-1.5 rounded-lg text-xs italic flex items-center gap-1">
                            Puesto vacante
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          {/* Right Side: Available Employees */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Personal Disponible</h4>
            <p className="text-xs text-slate-400 mb-4 font-normal">Haz clic sobre un colaborador para asignarlo al rol disponible en el banquete seleccionado.</p>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {['SUPERVISOR', 'CHEF', 'AYUDANTE_COCINA', 'GARZON', 'BARMAN'].map(role => {
                const avail = getAvailableEmployeesForRole(role as Staff['rol']);
                const limit = requiredCounts[role as keyof typeof requiredCounts] || 0;
                if (limit === 0) return null;

                return (
                  <div key={role} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-850 pb-1">
                      {role.replace('_', ' ')}s
                    </span>

                    {avail.length === 0 ? (
                      <span className="text-[11px] text-slate-650 block italic pl-2">No hay disponibles</span>
                    ) : (
                      avail.map(emp => (
                        <div
                          key={emp.id}
                          onClick={() => handleAssign(role, emp.nombre)}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 px-3 py-2 rounded-xl flex items-center justify-between text-xs text-slate-300 cursor-pointer transition-all group"
                        >
                          <span>{emp.nombre}</span>
                          <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 flex items-center gap-1 transition-all">
                            Asignar +
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
