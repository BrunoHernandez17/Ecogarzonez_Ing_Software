import React, { useState, useEffect } from 'react';
import { Calendar, Users, ClipboardList, AlertCircle, Utensils, Wine, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EVENT_TYPES } from '../../data/mockData';

export default function TareasStaff() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    fetch('http://localhost:8080/api/tareas/mis-tareas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTareas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tasks", err);
        setLoading(false);
      });
  }, [token]);

  const getEventTypeName = (typeId) => {
    const type = EVENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const getRoleIcon = () => {
    if (user.rol === 'CHEF') return <Utensils className="text-gold" size={24} />;
    if (user.rol === 'BARTENDER') return <Wine className="text-gold" size={24} />;
    if (user.rol === 'ASEO') return <Sparkles className="text-gold" size={24} />;
    return <Users className="text-gold" size={24} />; // Garzon
  };

  const getRoleTaskDescription = () => {
    if (user.rol === 'CHEF') return "Prepara los menús aprobados para las fechas indicadas.";
    if (user.rol === 'BARTENDER') return "Asegura el stock y prepara los tragos para los invitados.";
    if (user.rol === 'ASEO') return "Mantén la higiene de los espacios asignados.";
    return "Atiende las mesas asignadas con excelencia."; // Garzon
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gold/10 pb-4">
        <div className="p-3 bg-gold/10 rounded-full border border-gold/20">
          {getRoleIcon()}
        </div>
        <div>
          <h1 className="font-serif text-3xl text-white italic tracking-wide">Mis Tareas: {user.rol}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{getRoleTaskDescription()}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">Cargando tus tareas asignadas...</div>
      ) : tareas.length === 0 ? (
        <div className="bg-[#0C0C0C] border border-gold/10 rounded-xl p-12 text-center text-gray-500 space-y-3">
          <ClipboardList size={40} className="text-gold mx-auto" />
          <h3 className="font-serif text-lg text-white font-medium italic">Sin Tareas Asignadas</h3>
          <p className="text-sm max-w-sm mx-auto">
            Por el momento no tienes eventos asignados. El supervisor te notificará cuando se requiera tu apoyo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareas.map((tarea) => {
            const evento = tarea.evento;
            return (
              <div key={tarea.id} className="bg-[#0C0C0C] border border-gold/15 hover:border-gold/30 rounded-xl overflow-hidden shadow-lg transition-colors duration-300">
                <div className="p-5 space-y-4">
                  {/* Event Info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold">
                        {evento.id ? `EVT-00${evento.id}` : 'N/A'}
                      </span>
                      <h3 className="font-serif text-xl text-white italic mt-1 truncate">{evento.clientName}</h3>
                      <p className="text-xs text-gray-400 mt-1">{getEventTypeName(evento.eventType)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Calendar size={14} className="text-gold" />
                      <span>{evento.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Users size={14} className="text-gold" />
                      <span>{evento.guests} Invitados</span>
                    </div>
                  </div>
                </div>

                {/* Task detail specific to role */}
                <div className="bg-[#121212] border-t border-gold/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-light">Detalle de Asignación</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {tarea.detalle || 'Asignación general para este evento. Contacta al supervisor para más detalles.'}
                  </p>
                  
                  {/* Context depending on the role */}
                  {user.rol === 'CHEF' && evento.minuta && (
                    <div className="mt-3 p-3 bg-black/40 border border-white/5 rounded-lg">
                      <span className="text-[10px] uppercase text-gray-500 font-semibold block mb-1">Menú a Preparar:</span>
                      <strong className="text-xs text-white">{evento.minuta.nombre}</strong>
                      <p className="text-[10px] text-gray-400 mt-1">{evento.minuta.descripcion}</p>
                    </div>
                  )}
                  {user.rol === 'BARTENDER' && (
                    <div className="mt-3 p-3 bg-black/40 border border-white/5 rounded-lg">
                      <span className="text-[10px] uppercase text-gray-500 font-semibold block mb-1">Barra Seleccionada:</span>
                      <strong className="text-xs text-white">{evento.barId.replace(/_/g, ' ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
