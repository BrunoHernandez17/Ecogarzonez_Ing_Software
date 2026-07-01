import React from 'react';
import { X, Calendar, Users, Mail, DollarSign, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { FOOD_MENUS, BAR_OPTIONS, EVENT_TYPES, formatCLP } from '../data/mockData';

export default function EventModal({ event, onClose, onAccept, onReject }) {
  if (!event) return null;

  const eventTypeDetails = EVENT_TYPES.find(t => t.id === event.eventType);
  const foodDetails = FOOD_MENUS.find(m => m.id === event.menuId);
  const barDetails = BAR_OPTIONS.find(b => b.id === event.barId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Container */}
      <div className="relative bg-[#0F0F0F] border border-gold/20 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-[#0A0A0A]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
              ID: {event.id}
            </span>
            <h2 className="font-serif text-xl text-white mt-1.5 italic tracking-wide">
              Detalle de Cotización
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141414] p-4 rounded-lg border border-white/5 space-y-3">
              <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Cliente</span>
              <p className="text-white font-medium text-md">{event.clientName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Mail size={12} className="text-gold" />
                <span>{event.clientEmail}</span>
              </div>
            </div>

            <div className="bg-[#141414] p-4 rounded-lg border border-white/5 space-y-3">
              <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Servicio</span>
              <p className="text-white font-medium text-md">{eventTypeDetails?.name || event.eventType}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-gold" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-gold" />
                  <span>{event.guests} invitados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menú y Bar Selections */}
          <div className="space-y-4">
            <h3 className="font-serif text-md text-gold italic border-b border-gold/10 pb-1.5">Selección de Servicios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Gastronomía:</span>
                <p className="text-white font-medium text-sm">{foodDetails?.name}</p>
                <p className="text-xs text-gray-400 italic">
                  Incluye: {foodDetails?.items?.entrada.slice(0, 40)}..., {foodDetails?.items?.fondo.slice(0, 40)}...
                </p>
                <p className="text-xs text-gold-light mt-1">Valor p/p: {formatCLP(foodDetails?.pricePerPerson || 0)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Barra y Bebestibles:</span>
                <p className="text-white font-medium text-sm">{barDetails?.name}</p>
                <p className="text-xs text-gray-400 italic">{barDetails?.description.slice(0, 80)}...</p>
                <p className="text-xs text-gold-light mt-1">Valor p/p: {formatCLP(barDetails?.pricePerPerson || 0)}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-[#141414] p-5 rounded-lg border border-gold/10 space-y-3">
            <h3 className="font-serif text-md text-white italic">Presupuesto Desglosado</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Costo base del evento ({eventTypeDetails?.name}):</span>
                <span className="text-white">{formatCLP(eventTypeDetails?.basePrice || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio gastronómico ({event.guests} x {formatCLP(foodDetails?.pricePerPerson || 0)}):</span>
                <span className="text-white">{formatCLP((foodDetails?.pricePerPerson || 0) * event.guests)}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio de barra ({event.guests} x {formatCLP(barDetails?.pricePerPerson || 0)}):</span>
                <span className="text-white">{formatCLP((barDetails?.pricePerPerson || 0) * event.guests)}</span>
              </div>
              <div className="border-t border-gray-800 my-2 pt-2 flex justify-between font-semibold text-md">
                <span className="text-gold">Monto Total Estimado:</span>
                <span className="text-gold">{formatCLP(event.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-gray-500">Estado actual:</span>
            <span 
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'Aprobado' 
                  ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                  : event.status === 'Rechazado'
                  ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                  : 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/30'
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gold/10 bg-[#0A0A0A] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-sm transition-colors duration-300"
          >
            Volver
          </button>
          
          {event.status === 'Pendiente' && (
            <>
              <button
                onClick={() => {
                  onReject(event.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-900/30 hover:bg-red-950/20 text-red-400 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                <XCircle size={16} />
                <span>Rechazar</span>
              </button>
              <button
                onClick={() => {
                  onAccept(event.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-gold-dark to-gold text-black hover:from-gold hover:to-gold-light rounded-lg text-sm font-semibold transition-all duration-300 shadow-md"
              >
                <CheckCircle2 size={16} />
                <span>Aceptar Evento</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
