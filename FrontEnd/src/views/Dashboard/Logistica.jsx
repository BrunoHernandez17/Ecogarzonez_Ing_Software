import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Calendar, UserCheck, ShieldAlert } from 'lucide-react';
import { EVENT_TYPES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function Logistica({ events }) {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [assigningRole, setAssigningRole] = useState(null); // 'CHEF', 'GARZON', 'ASEO'
  const [staffList, setStaffList] = useState([]);
  const [tareasEvent, setTareasEvent] = useState([]);
  const { token } = useAuth();

  // Only approved events require logistics assignments
  const approvedEvents = events.filter(e => e.status?.toUpperCase() === 'APROBADO');
  const selectedEvent = approvedEvents.find(e => e.id === selectedEventId) || approvedEvents[0];

  useEffect(() => {
    // Fetch all staff members
    fetch('http://localhost:8080/api/auth/staff', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        return [];
      })
      .then(data => setStaffList(data))
      .catch(err => console.error("Error fetching staff", err));
  }, [token]);

  useEffect(() => {
    if (selectedEvent) {
      // Fetch tareas for this event
      const dbId = getDbId(selectedEvent.id);
      fetch(`http://localhost:8080/api/tareas/evento/${dbId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          return [];
        })
        .then(data => setTareasEvent(data))
        .catch(err => console.error("Error fetching tareas", err));
    }
  }, [selectedEvent, token]);

  const getDbId = (id) => {
    if (typeof id === 'string') {
      const match = id.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    return id;
  };

  const getEventTypeName = (typeId) => {
    const type = EVENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const getRequiredStaffCount = (guests, role) => {
    if (role === 'GARZON') return Math.max(1, Math.ceil(guests / 15));
    if (role === 'CHEF') return Math.max(1, Math.ceil(guests / 30));
    if (role === 'ASEO') return Math.max(1, Math.ceil(guests / 50));
    if (role === 'BARTENDER') return Math.max(1, Math.ceil(guests / 40));
    return 0;
  };

  const getAssignedStaffDetails = () => {
    return tareasEvent.map(t => ({
      tareaId: t.id,
      staffId: t.staff?.id,
      name: t.staff?.nombre,
      role: t.rolAsignado
    }));
  };

  const handleOpenAssign = (role) => {
    if (!selectedEvent) return;
    setAssigningRole(role);
  };

  const handleAssignMember = (staffMember) => {
    if (!selectedEvent) return;
    const dbId = getDbId(selectedEvent.id);

    const nuevaTarea = {
      evento: { id: dbId },
      staff: { id: staffMember.id },
      rolAsignado: staffMember.rol,
      detalle: `Asignado como ${staffMember.rol} al evento ${selectedEvent.clientName}`
    };

    fetch('http://localhost:8080/api/tareas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevaTarea)
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Error saving assignment');
      })
      .then(savedTarea => {
        setTareasEvent(prev => [...prev, savedTarea]);
        setAssigningRole(null);
      })
      .catch(err => console.error(err));
  };

  const handleRemoveMember = (tareaId) => {
    // In a real app we would have a DELETE /api/tareas/{id} endpoint
    // For now we will mock it in UI if backend endpoint isn't fully implemented
    console.log("Remove assigned tarea: ", tareaId);
    setTareasEvent(prev => prev.filter(t => t.id !== tareaId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="font-serif text-3xl text-white italic tracking-wide">Logística de Personal</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Asignación de Staff para Eventos Aprobados</p>
      </div>

      {approvedEvents.length === 0 ? (
        <div className="bg-[#0C0C0C] border border-gold/10 rounded-xl p-12 text-center text-gray-500 space-y-3">
          <ShieldAlert size={40} className="text-gold mx-auto" />
          <h3 className="font-serif text-lg text-white font-medium italic">Sin Eventos Aprobados</h3>
          <p className="text-sm max-w-sm mx-auto">
            Actualmente no hay eventos aprobados. Por favor aprueba cotizaciones en la pestaña de "Eventos".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-[#0C0C0C] border border-gold/10 rounded-xl p-5 space-y-4">
            <h3 className="font-serif text-md text-gold italic border-b border-gold/5 pb-2 flex items-center gap-2">
              <Calendar size={18} />
              <span>Eventos por Gestionar</span>
            </h3>
            
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {approvedEvents.map((evt) => {
                const active = selectedEvent?.id === evt.id;
                
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 space-y-2 ${
                      active
                        ? 'bg-gold/5 border-gold shadow'
                        : 'bg-[#121212] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold">{evt.id}</span>
                      <span className="text-[10px] text-gray-500">{evt.date}</span>
                    </div>
                    <h4 className="text-white font-medium text-xs truncate">{evt.clientName}</h4>
                    <p className="text-[10px] text-gray-400">{getEventTypeName(evt.eventType)} • {evt.guests} invitados</p>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedEvent && (
            <div className="lg:col-span-2 bg-[#0C0C0C] border border-gold/10 rounded-xl p-6 space-y-6">
              <div className="border-b border-gold/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] text-gold uppercase font-bold tracking-wider">{selectedEvent.id}</span>
                  <h2 className="font-serif text-xl text-white italic mt-1">{selectedEvent.clientName}</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {getEventTypeName(selectedEvent.eventType)} • {selectedEvent.date} • {selectedEvent.guests} Invitados
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {['CHEF', 'GARZON', 'BARTENDER', 'ASEO'].map((role) => {
                  const required = getRequiredStaffCount(selectedEvent.guests, role);
                  const assigned = getAssignedStaffDetails().filter(s => s.role === role);
                  const isFull = assigned.length >= required;

                  return (
                    <div key={role} className="space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gold" />
                          <h4 className="text-xs uppercase font-bold tracking-wider text-white">{role}</h4>
                          <span className="text-[10px] text-gray-500 italic">(Requiere: {required})</span>
                        </div>
                        <span className={`text-xs font-semibold ${isFull ? 'text-green-400' : 'text-yellow-400'}`}>
                          {assigned.length} de {required} Asignados
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2.5 min-h-[40px] items-center">
                        {assigned.length > 0 ? (
                          assigned.map((staff) => (
                            <div
                              key={staff.tareaId}
                              className="flex items-center gap-2 bg-[#161616] border border-gold/10 pl-3 pr-1.5 py-1 rounded-full text-xs text-gray-300"
                            >
                              <span className="font-medium text-white">{staff.name}</span>
                              <button
                                onClick={() => handleRemoveMember(staff.tareaId)}
                                className="p-1 text-gray-500 hover:text-red-400 rounded-full hover:bg-red-950/20 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 italic">No hay asignados.</span>
                        )}

                        {!isFull && (
                          <button
                            onClick={() => handleOpenAssign(role)}
                            className="flex items-center gap-1 bg-gold/10 hover:bg-gold/25 border border-gold/20 text-gold text-xs px-3.5 py-1 rounded-full transition-all duration-300"
                          >
                            <UserPlus size={12} />
                            <span>Asignar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {assigningRole && (
                <div className="border border-gold/20 bg-[#121212] p-5 rounded-lg space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-md text-gold italic">
                      Seleccionar {assigningRole} Disponible
                    </h4>
                    <button 
                      onClick={() => setAssigningRole(null)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {staffList.filter(
                      s => s.rol === assigningRole && !tareasEvent.some(t => t.staff?.id === s.id)
                    ).map((staff) => (
                      <div
                        key={staff.id}
                        onClick={() => handleAssignMember(staff)}
                        className="bg-[#181818] border border-gray-800 hover:border-gold/30 hover:bg-gold/5 p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-300"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{staff.nombre}</p>
                          <span className="text-[10px] text-gray-500">{staff.email}</span>
                        </div>
                        <UserCheck size={14} className="text-gold" />
                      </div>
                    ))}
                    {staffList.filter(
                      s => s.rol === assigningRole && !tareasEvent.some(t => t.staff?.id === s.id)
                    ).length === 0 && (
                      <p className="text-xs text-gray-500 italic col-span-2">
                        Todo el personal de este rol ya está asignado o no hay disponibles en la base.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
