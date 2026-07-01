import React, { useState } from 'react';
import { Eye, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { formatCLP, EVENT_TYPES } from '../../data/mockData';
import EventModal from '../../components/EventModal';

export default function Eventos({ events, onAcceptEvent, onRejectEvent }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const getEventTypeName = (typeId) => {
    const type = EVENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const filteredEvents = events.filter(evt => {
    const statusMatch = evt.status?.toUpperCase() || '';
    const filterUpper = filterStatus.toUpperCase();
    const matchesStatus = filterUpper === 'TODOS' || statusMatch === filterUpper;
    const matchesSearch = evt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white italic tracking-wide">Gestor de Eventos</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Solicitudes de cotización entrantes</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0C0C0C] p-4 rounded-xl border border-gold/10">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-gold transition-colors duration-300"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 ${
                filterStatus === status
                  ? 'bg-gold text-black'
                  : 'bg-[#121212] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#0C0C0C] border border-gold/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050505] text-gold border-b border-gold/10 font-serif italic text-sm">
                <th className="py-4 px-6 font-normal">ID</th>
                <th className="py-4 px-6 font-normal">Cliente</th>
                <th className="py-4 px-6 font-normal">Tipo de Evento</th>
                <th className="py-4 px-6 font-normal">Fecha</th>
                <th className="py-4 px-6 font-normal">Invitados</th>
                <th className="py-4 px-6 font-normal">Monto Total</th>
                <th className="py-4 px-6 font-normal">Estado</th>
                <th className="py-4 px-6 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-gray-300">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => (
                  <tr 
                    key={evt.id}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-300"
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <td className="py-4 px-6 font-semibold text-gold">{evt.id}</td>
                    <td className="py-4 px-6 font-medium text-white">{evt.clientName}</td>
                    <td className="py-4 px-6">{getEventTypeName(evt.eventType)}</td>
                    <td className="py-4 px-6">{evt.date}</td>
                    <td className="py-4 px-6">{evt.guests}</td>
                    <td className="py-4 px-6 font-semibold">{formatCLP(evt.totalPrice)}</td>
                    <td className="py-4 px-6">
                      <span 
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          evt.status?.toUpperCase() === 'APROBADO' 
                            ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                            : evt.status?.toUpperCase() === 'RECHAZADO'
                            ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                            : 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/30'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          title="Ver Detalle"
                          className="p-1.5 bg-gray-900 text-gray-400 hover:text-white rounded border border-gray-800 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        
                        {evt.status?.toUpperCase() === 'PENDIENTE' && (
                          <>
                            <button
                              onClick={() => onAcceptEvent(evt.id)}
                              title="Aceptar Evento"
                              className="p-1.5 bg-green-950/20 text-green-400 hover:bg-green-950/40 rounded border border-green-900/30 transition-colors"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              onClick={() => onRejectEvent(evt.id)}
                              title="Rechazar Evento"
                              className="p-1.5 bg-red-950/20 text-red-400 hover:bg-red-950/40 rounded border border-red-900/30 transition-colors"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500 font-medium">
                    No se encontraron cotizaciones asociadas a este criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAccept={onAcceptEvent}
          onReject={onRejectEvent}
        />
      )}

    </div>
  );
}
