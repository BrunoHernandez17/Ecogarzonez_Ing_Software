import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckSquare, Square, CheckCircle, ShieldAlert, Navigation, HelpCircle, Truck, AlertTriangle } from 'lucide-react';
import { EventRequest, Staff } from '../types';

interface EmployeeMobileProps {
  events: EventRequest[];
  employees: Staff[];
  onConfirmAvailability: (employeeName: string, confirmed: boolean) => void;
  onConfirmTransfer: (employeeName: string, confirmed: boolean) => void;
  onClockInOut: (employeeName: string, type: 'in' | 'out') => void;
  onReportIncident: (incident: { description: string; severity: 'BAJA' | 'MEDIA' | 'ALTA'; staffName: string }) => void;
}

export default function EmployeeMobile({
  events,
  employees,
  onConfirmAvailability,
  onConfirmTransfer,
  onClockInOut,
  onReportIncident
}: EmployeeMobileProps) {
  const [selectedEmpId, setSelectedEmpId] = useState<number>(1);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Incident form state
  const [incDescription, setIncDescription] = useState('');
  const [incSeverity, setIncSeverity] = useState<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA');
  const [incidentReportedMsg, setIncidentReportedMsg] = useState(false);

  const activeEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Find the event the employee is assigned to
  const assignedEvent = events.find(event => {
    // @ts-ignore
    if (!event.assignedStaff) return false;
    // @ts-ignore
    return Object.values(event.assignedStaff).flat().includes(activeEmployee.nombre);
  });

  // Read the assignment specifics for this staff inside the event
  const assignmentDetails = useMemo(() => {
    if (!assignedEvent) return null;
    let roleAssigned = 'COLABORADOR';
    // @ts-ignore
    Object.entries(assignedEvent.assignedStaff).forEach(([role, names]) => {
      // @ts-ignore
      if (names.includes(activeEmployee.nombre)) {
        roleAssigned = role;
      }
    });

    return {
      role: roleAssigned
    };
  }, [assignedEvent, activeEmployee]);

  // Local state representing clock-in/out for animation
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockedOut, setClockedOut] = useState(false);
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Confirmar uniforme corporativo planchado', done: true },
    { id: 2, text: 'Check-in de abordaje al bus de traslado', done: false },
    { id: 3, text: 'Recepción del layout del supervisor', done: false },
    { id: 4, text: 'Montaje de cubertería y mantelería', done: false },
    { id: 5, text: 'Servicio y atención de mesas asignadas', done: false },
    { id: 6, text: 'Apoyo en el desmontaje y control de mermas', done: false }
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  useEffect(() => {
    let interval: any;
    if (isClockedIn && !clockedOut) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockedOut]);

  const formatElapsedTime = (sec: number) => {
    const hours = Math.floor(sec / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsClockedIn(true);
    setClockedOut(false);
    onClockInOut(activeEmployee.nombre, 'in');
    
    // Auto check check-in task
    setTasks(prev => prev.map(t => t.id === 2 ? { ...t, done: true } : t));
  };

  const handleClockOut = () => {
    setClockedOut(true);
    setIsClockedIn(false);
    onClockInOut(activeEmployee.nombre, 'out');
  };

  const handleConfirmAvailability = (val: boolean) => {
    setAvailabilityConfirmed(val);
    onConfirmAvailability(activeEmployee.nombre, val);
  };

  const handleConfirmTransfer = (val: boolean) => {
    setTransferConfirmed(val);
    onConfirmTransfer(activeEmployee.nombre, val);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incDescription.trim()) return;
    onReportIncident({
      description: incDescription.trim(),
      severity: incSeverity,
      staffName: activeEmployee.nombre
    });
    setIncDescription('');
    setIncidentReportedMsg(true);
    setTimeout(() => setIncidentReportedMsg(false), 3000);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-md mx-auto animate-in fade-in duration-300">
      
      {/* Profile Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs">
        <label className="text-slate-455 font-bold uppercase">Acceder al Dispositivo del Staff:</label>
        <select
          value={selectedEmpId}
          onChange={(e) => {
            setSelectedEmpId(Number(e.target.value));
            setIsClockedIn(false);
            setClockInTime(null);
            setClockedOut(false);
            setAvailabilityConfirmed(false);
            setTransferConfirmed(false);
          }}
          className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none cursor-pointer"
        >
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre} ({emp.rol.replace('_', ' ')})
            </option>
          ))}
        </select>
      </div>

      {/* Smartphone frame */}
      <div className="bg-[#0b0f19] border-4 border-slate-850 rounded-[40px] shadow-2xl relative overflow-hidden aspect-[9/19] flex flex-col justify-between">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-850 rounded-b-2xl z-40 flex items-center justify-center">
          <div className="w-12 h-1 bg-black rounded-full mb-1" />
        </div>

        {/* Mobile Header */}
        <div className="pt-8 px-5 pb-3 border-b border-slate-900/60 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400">ECOSTAFF DIGITAL</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-slate-400">GPS Habilitado</span>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          
          {/* Avatar card */}
          <div className="bg-slate-900/50 border border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              {activeEmployee.nombre.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-none">{activeEmployee.nombre}</h4>
              <span className="text-[8px] text-slate-500 font-bold uppercase mt-1 block">
                {activeEmployee.rol.replace('_', ' ')}
              </span>
            </div>
          </div>

          {!assignedEvent ? (
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 text-center">
              <ShieldAlert className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-slate-400">Sin Asignaciones</h5>
              <p className="text-[9px] text-slate-500 mt-1">
                No tienes turnos programados en este momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Event detail */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-emerald-400 uppercase bg-slate-950 px-2 py-0.5 rounded">
                    Turno Asignado
                  </span>
                  <span className="text-slate-400">{assignedEvent.fechaEvento}</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">{assignedEvent.nombre}</h5>
                  <p className="text-[9px] text-slate-550 truncate mt-0.5">{assignedEvent.ubicacion}</p>
                </div>
              </div>

              {/* Step 1: Confirm Availability */}
              {!availabilityConfirmed ? (
                <div className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl text-center space-y-3">
                  <HelpCircle className="w-5 h-5 text-emerald-450 mx-auto" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">¿Confirmar Disponibilidad?</h5>
                    <p className="text-[9px] text-slate-500">Confirma si aceptas tomar este turno de banquete.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmAvailability(true)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                    >
                      Aceptar Turno
                    </button>
                    <button
                      onClick={() => alert('Turno rechazado. Se informará al supervisor.')}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-[10px] hover:text-rose-400 cursor-pointer"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 2: Confirm Logistics Transport */}
                  {!transferConfirmed ? (
                    <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                        <Truck className="w-4 h-4 text-emerald-450" /> Confirmar Traslado
                      </div>
                      <p className="text-[9px] text-slate-500">¿Abordaste el transporte provisto para el traslado al recinto del evento?</p>
                      <button
                        onClick={() => handleConfirmTransfer(true)}
                        className="w-full py-2 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        Confirmar Subida al Bus
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/20 border border-emerald-900/20 px-3 py-2 rounded-xl text-center text-[10px] text-emerald-450 font-bold flex items-center justify-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Traslado Registrado Exitosamente
                    </div>
                  )}

                  {/* Step 3: Check-in / Out GPS based */}
                  <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl text-center space-y-3">
                    <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-450">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Registro de Asistencia GPS
                    </div>

                    {!isClockedIn ? (
                      <button
                        onClick={handleClockIn}
                        disabled={assignedEvent.estado !== 'EN_EJECUCION'}
                        className={`w-full py-2.5 rounded-lg text-[10px] font-bold transition-all ${
                          assignedEvent.estado === 'EN_EJECUCION'
                            ? 'bg-emerald-650 hover:bg-emerald-600 text-white cursor-pointer active:scale-95'
                            : 'bg-slate-850 text-slate-550 cursor-not-allowed'
                        }`}
                      >
                        {assignedEvent.estado !== 'EN_EJECUCION' ? 'Banquete aún no Iniciado' : 'Marcar Check-in Digital'}
                      </button>
                    ) : clockedOut ? (
                      <div className="bg-emerald-950/15 border border-emerald-900/20 py-2.5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-450 mx-auto mb-0.5" />
                        <span className="text-[9px] text-emerald-400 font-bold">Salida Registrada (Check-out)</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-xl font-bold font-mono tracking-widest text-white animate-pulse">
                          {formatElapsedTime(secondsElapsed)}
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">
                          Entrada: {clockInTime} (Lat: -33.415, Lon: -70.589)
                        </div>
                        <button
                          onClick={handleClockOut}
                          className="w-full py-2 bg-rose-950/45 hover:bg-rose-900/40 border border-rose-900/55 text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Marcar Check-out
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Task checklist */}
                  <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white uppercase tracking-wider text-[9px]">Checklist del Turno ({progressPct}%)</span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">{completedCount}/{tasks.length}</span>
                    </div>

                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="space-y-2 pt-1 max-h-32 overflow-y-auto">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className="flex items-start gap-2 cursor-pointer text-[10px] text-slate-400 hover:text-slate-200 transition-all"
                        >
                          {task.done ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                          )}
                          <span className={task.done ? 'line-through text-slate-600' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Report Incident Form */}
                  <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-rose-455 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Reportar Incidencia
                    </div>
                    
                    <form onSubmit={handleIncidentSubmit} className="space-y-2">
                      <textarea
                        placeholder="Detalle imprevistos en terreno (vajilla rota, retraso de entrega, etc.)"
                        value={incDescription}
                        onChange={(e) => setIncDescription(e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-[10px] focus:outline-none focus:border-rose-900"
                      />
                      
                      <div className="flex justify-between items-center">
                        <select
                          value={incSeverity}
                          onChange={(e) => setIncSeverity(e.target.value as any)}
                          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[9px] text-white focus:outline-none cursor-pointer"
                        >
                          <option value="BAJA">Gravedad: Baja</option>
                          <option value="MEDIA">Gravedad: Media</option>
                          <option value="ALTA">Gravedad: Alta</option>
                        </select>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-rose-650 hover:bg-rose-600 text-white rounded text-[9px] font-bold cursor-pointer"
                        >
                          Reportar
                        </button>
                      </div>
                    </form>
                    
                    {incidentReportedMsg && (
                      <div className="text-[9px] text-rose-400 text-center italic">
                        Incidencia enviada al Administrador.
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          )}

        </div>

        {/* Home bar */}
        <div className="pb-3 pt-2 flex justify-center bg-slate-955/80 border-t border-slate-900/60 sticky bottom-0">
          <div className="w-24 h-1 bg-slate-800 rounded-full" />
        </div>

      </div>
    </div>
  );
}
