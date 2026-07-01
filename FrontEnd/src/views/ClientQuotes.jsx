import React, { useState } from 'react';
import { FileText, Calendar, Users, Utensils, Wine, Clock, Landmark, Sparkles, UserCheck } from 'lucide-react';
import { FOOD_MENUS, BAR_OPTIONS, EVENT_TYPES, formatCLP } from '../data/mockData';

export default function ClientQuotes({ events, setView }) {
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Group events by client email search if they search, or show session events
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (filteredQuotes.length > 0) {
      setSelectedQuoteId(filteredQuotes[0].id);
    } else {
      setSelectedQuoteId(null);
    }
  };

  const filteredQuotes = hasSearched && searchEmail
    ? events.filter(evt => evt.clientEmail.toLowerCase().trim() === searchEmail.toLowerCase().trim())
    : events; // Default to all events for easy mock testing

  const activeQuote = filteredQuotes.find(q => q.id === selectedQuoteId) || filteredQuotes[0];

  const getEventTypeName = (typeId) => {
    return EVENT_TYPES.find(t => t.id === typeId)?.name || typeId;
  };

  const foodDetails = activeQuote?.minuta || null;
  const barDetails = BAR_OPTIONS.find(b => b.id === activeQuote?.barId);
  const eventDetails = EVENT_TYPES.find(t => t.id === activeQuote?.eventType);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl text-white italic tracking-wide">Portal del Cliente</h1>
        <p className="text-xs uppercase tracking-widest text-gold mt-1.5 font-medium">Seguimiento de Cotizaciones y Minutas</p>
      </div>

      {/* Tracker Search Bar (Optional Mock lookup) */}
      <div className="max-w-md mx-auto bg-[#0C0C0C] border border-gold/10 p-5 rounded-xl space-y-4">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">
            Ingresa tu email para filtrar tus solicitudes
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Ej: javiera.silva@gmail.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 bg-[#121212] border border-gray-800 rounded-lg py-2 px-4 text-white text-xs focus:outline-none focus:border-gold transition-all"
            />
            <button
              type="submit"
              className="bg-gold text-black font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-lg hover:bg-gold-light transition-all shrink-0"
            >
              Buscar
            </button>
          </div>
          {hasSearched && (
            <button 
              type="button"
              onClick={() => { setSearchEmail(''); setHasSearched(false); setSelectedQuoteId(null); }}
              className="text-[10px] text-gray-500 hover:text-gold transition-colors block"
            >
              Mostrar todas las cotizaciones de prueba
            </button>
          )}
        </form>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="bg-[#0C0C0C] border border-gold/10 rounded-xl p-12 text-center text-gray-500 space-y-4 max-w-2xl mx-auto">
          <FileText size={40} className="text-gold mx-auto" />
          <h3 className="font-serif text-lg text-white font-medium italic">No encontramos cotizaciones</h3>
          <p className="text-sm">
            No hay cotizaciones registradas para el correo **{searchEmail}**. ¿Por qué no creas una nueva usando el cotizador interactivo?
          </p>
          <button
            onClick={() => setView('cotizador')}
            className="px-6 py-2 bg-gold text-black hover:bg-gold-light text-xs tracking-widest uppercase rounded-full font-semibold transition-all"
          >
            Ir al Cotizador
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List of Quotes */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-serif text-lg text-white italic border-b border-gold/10 pb-2">Mis Solicitudes</h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {filteredQuotes.map((evt) => {
                const active = activeQuote?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedQuoteId(evt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 space-y-2.5 ${
                      active
                        ? 'bg-gold/5 border-gold shadow'
                        : 'bg-[#0C0C0C] border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold">{evt.id}</span>
                      <span 
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          evt.status === 'Aprobado' 
                            ? 'bg-green-950/40 text-green-400 border border-green-900/20'
                            : evt.status === 'Rechazado'
                            ? 'bg-red-950/40 text-red-400 border border-red-900/20'
                            : 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/20'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-white text-xs font-semibold">{getEventTypeName(evt.eventType)}</h4>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar size={10} className="text-gold" />
                        <span>{evt.date} • {evt.guests} invitados</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-semibold text-white">{formatCLP(evt.totalPrice)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Quote Detail - Minuta View */}
          {activeQuote && (
            <div className="lg:col-span-2 bg-[#0C0C0C] border border-gold/15 rounded-xl p-6 md:p-8 space-y-8 shadow-2xl">
              
              {/* Card Header */}
              <div className="border-b border-gold/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/25">
                      Ficha de Servicio
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">ID: {activeQuote.id}</span>
                  </div>
                  <h2 className="font-serif text-3xl text-white italic mt-2">{getEventTypeName(activeQuote.eventType)}</h2>
                  <p className="text-xs text-gray-400 mt-1">Titular de cotización: {activeQuote.clientName} ({activeQuote.clientEmail})</p>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-medium">Estado de Solicitud</span>
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      activeQuote.status === 'Aprobado' 
                        ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                        : activeQuote.status === 'Rechazado'
                        ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                        : 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/30'
                    }`}
                  >
                    {activeQuote.status}
                  </span>
                </div>
              </div>

              {/* Event details items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-1 text-center sm:text-left">
                  <Calendar className="text-gold mx-auto sm:mx-0" size={16} />
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Fecha Evento</span>
                  <span className="text-xs font-semibold text-white block">{activeQuote.date}</span>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-1 text-center sm:text-left">
                  <Users className="text-gold mx-auto sm:mx-0" size={16} />
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">N° Invitados</span>
                  <span className="text-xs font-semibold text-white block">{activeQuote.guests} asistentes</span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#121212] p-4 rounded-lg border border-white/5 space-y-1 text-center sm:text-left">
                  <Clock className="text-gold mx-auto sm:mx-0" size={16} />
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Ingreso de Solicitud</span>
                  <span className="text-xs font-semibold text-white block">{activeQuote.createdAt || 'Reciente'}</span>
                </div>
              </div>

              {/* MINUTA DETALLADA */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl text-gold italic border-b border-gold/10 pb-2 flex items-center gap-2">
                  <FileText size={20} />
                  <span>Minuta de Banquetería</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Gastronomy Minuta Card */}
                  <div className="bg-[#121212] rounded-xl border border-white/5 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-white border-b border-white/5 pb-2">
                      <Utensils size={16} className="text-gold" />
                      <h4 className="font-serif text-md italic font-semibold">{foodDetails?.nombre}</h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-gold-light block font-semibold">Descripción</span>
                        <p className="text-gray-300 mt-0.5 leading-relaxed whitespace-pre-line">{foodDetails?.descripcion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Drink Minuta Card */}
                  <div className="bg-[#121212] rounded-xl border border-white/5 p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white border-b border-white/5 pb-2">
                        <Wine size={16} className="text-gold" />
                        <h4 className="font-serif text-md italic font-semibold">{barDetails?.name}</h4>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-gold-light block font-semibold">Descripción del Servicio</span>
                        <p className="text-xs text-gray-300 leading-relaxed">{barDetails?.description}</p>
                      </div>
                    </div>

                    <div className="bg-[#181818] p-3 rounded border border-white/5 text-[10px] text-gray-400 mt-4 flex items-center gap-2">
                      <Sparkles className="text-gold text-xs shrink-0" size={14} />
                      <span>Bar libre e ilimitado para todos tus asistentes durante el evento.</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* LOGISTICS AND ALLOCATION REPORT */}
              <div className="bg-[#121212] rounded-xl border border-white/5 p-5 space-y-3">
                <h3 className="font-serif text-md text-white italic border-b border-white/5 pb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-gold" />
                  <span>Estado Logístico y Personal Asignado</span>
                </h3>

                {activeQuote.status === 'Aprobado' ? (
                  <div className="text-xs text-gray-300 space-y-2 leading-relaxed">
                    <p>
                      ¡Tu evento está programado y listo para ser ejecutado! De acuerdo al número de invitados ({activeQuote.guests}), hemos estructurado la siguiente dotación de personal:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gold-light">
                      <li>Garzones requeridos: {Math.max(1, Math.ceil(activeQuote.guests / 15))} garzones calificados.</li>
                      <li>Cocineros asignados: {Math.max(1, Math.ceil(activeQuote.guests / 30))} personal de cocina.</li>
                      <li>Soporte de Limpieza: {Math.max(1, Math.ceil(activeQuote.guests / 50))} operario.</li>
                    </ul>
                    {activeQuote.assignedStaff.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        * Actualmente contamos con {activeQuote.assignedStaff.length} miembros del personal nominalmente reservados para este evento.
                      </p>
                    )}
                  </div>
                ) : activeQuote.status === 'Rechazado' ? (
                  <p className="text-xs text-red-400 italic">
                    Esta cotización ha sido denegada por la administración. Si tienes dudas o deseas renegociar las condiciones, por favor ponte en contacto directo al correo de contacto.
                  </p>
                ) : (
                  <p className="text-xs text-yellow-400 italic">
                    La cotización se encuentra bajo revisión de viabilidad técnica y logística. Una vez aprobada, se calculará y asignará automáticamente el staff del servicio (garzones y cocineros).
                  </p>
                )}
              </div>

              {/* BUDGET SUMMARY CARD */}
              <div className="bg-gradient-to-r from-gold-dark/10 to-gold/5 border border-gold/30 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Total de tu Presupuesto</span>
                  <strong className="text-gold text-2xl lg:text-3xl font-bold tracking-wider">{formatCLP(activeQuote.totalPrice)}</strong>
                </div>
                <div className="text-center sm:text-right space-y-1 text-xs text-gray-400">
                  <div>Base ({getEventTypeName(activeQuote.eventType)}): {formatCLP(eventDetails?.basePrice || 0)}</div>
                  <div>Gastronomía p/p: {formatCLP(foodDetails?.precioPorPersona || 0)} • Bar p/p: {formatCLP(barDetails?.pricePerPerson || 0)}</div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
