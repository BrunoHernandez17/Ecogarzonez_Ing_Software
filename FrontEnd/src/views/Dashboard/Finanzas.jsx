import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { formatCLP, EVENT_TYPES } from '../../data/mockData';

export default function Finanzas({ events }) {
  // Financial metrics calculated dynamically based on event lists
  const approvedEvents = events.filter(e => e.status === 'Aprobado');
  const pendingEvents = events.filter(e => e.status === 'Pendiente');

  const totalIngresos = approvedEvents.reduce((sum, e) => sum + e.totalPrice, 0);
  const totalCostos = approvedEvents.reduce((sum, e) => sum + e.cost, 0);
  const totalUtilidad = totalIngresos - totalCostos;

  const totalPendientes = pendingEvents.reduce((sum, e) => sum + e.totalPrice, 0);

  const profitMargin = totalIngresos > 0 ? Math.round((totalUtilidad / totalIngresos) * 100) : 0;

  const getEventTypeName = (typeId) => {
    const type = EVENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const kpiData = [
    {
      title: 'Ingresos Totales (Aprobados)',
      value: formatCLP(totalIngresos),
      desc: `${approvedEvents.length} eventos confirmados`,
      color: 'border-green-500/20 text-green-400 bg-green-500/5'
    },
    {
      title: 'Costos Operacionales',
      value: formatCLP(totalCostos),
      desc: 'Banquetería, bar y logística',
      color: 'border-red-500/20 text-red-400 bg-red-500/5'
    },
    {
      title: 'Utilidad Neta Estimada',
      value: formatCLP(totalUtilidad),
      desc: `Margen de ganancia: ${profitMargin}%`,
      color: 'border-gold/20 text-gold bg-gold/5 glow-gold'
    },
    {
      title: 'Ingresos en Proceso (Pendientes)',
      value: formatCLP(totalPendientes),
      desc: `${pendingEvents.length} cotizaciones pendientes`,
      color: 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* View Header */}
      <div>
        <h1 className="font-serif text-3xl text-white italic tracking-wide">Métricas Financieras</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Monitoreo de ingresos, costos y utilidades</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl border flex flex-col justify-between bg-[#0C0C0C] ${kpi.color}`}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
              {kpi.title}
            </span>
            <div className="my-3">
              <strong className="text-xl lg:text-2xl font-bold tracking-wide block">
                {kpi.value}
              </strong>
            </div>
            <span className="text-[10px] text-gray-500 block">
              {kpi.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Visual analytics block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Margin gauge */}
        <div className="lg:col-span-1 bg-[#0C0C0C] border border-gold/10 p-6 rounded-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-white italic border-b border-white/5 pb-2">Rendimiento Financiero</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              La proporción de utilidad frente a los ingresos totales de eventos aprobados representa la rentabilidad de la banquetera.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Porcentaje de Margen</span>
              <span className="text-gold font-bold">{profitMargin}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, profitMargin)}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-[#121212] p-3 rounded border border-white/5">
              <TrendingUp size={14} className="text-gold" />
              <span>Meta de la industria: ~35% de margen neto.</span>
            </div>
          </div>
        </div>

        {/* Confirmed transactions list */}
        <div className="lg:col-span-2 bg-[#0C0C0C] border border-gold/10 p-6 rounded-xl space-y-4">
          <h3 className="font-serif text-lg text-white italic border-b border-white/5 pb-2">Historial de Flujo de Caja</h3>
          
          <div className="overflow-x-auto max-h-[30vh] pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gold border-b border-gray-900 pb-2">
                  <th className="py-2.5 px-3">ID Evento</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3 text-right">Costo Oper.</th>
                  <th className="py-2.5 px-3 text-right">Ingreso Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/50 text-gray-300">
                {approvedEvents.length > 0 ? (
                  approvedEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-3 font-semibold text-gold">{evt.id}</td>
                      <td className="py-3 px-3 truncate max-w-[150px]">{evt.clientName}</td>
                      <td className="py-3 px-3">{getEventTypeName(evt.eventType)}</td>
                      <td className="py-3 px-3">{evt.date}</td>
                      <td className="py-3 px-3 text-right text-red-400 font-medium">-{formatCLP(evt.cost)}</td>
                      <td className="py-3 px-3 text-right text-green-400 font-semibold">+{formatCLP(evt.totalPrice)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 italic">
                      No hay transacciones registradas. Aprueba eventos para ver el flujo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
