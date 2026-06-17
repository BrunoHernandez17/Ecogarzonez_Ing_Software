import React, { useState, useMemo } from 'react';
import { Calendar, Users, MapPin, Coffee, Utensils, Clipboard, ShieldCheck, ArrowRight, ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Menu, EventRequest } from '../types';

interface WizardPortalProps {
  menus: Menu[];
  onSubmit: (newEvent: Omit<EventRequest, 'id'>, payDetails?: { method: string; transId: string }) => void;
  onNavigateToDashboard: () => void;
}

export default function WizardPortal({ menus, onSubmit, onNavigateToDashboard }: WizardPortalProps) {
  const [step, setStep] = useState(1);
  
  // Client Form
  const [nombre, setNombre] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Event Form
  const [nombreEvento, setNombreEvento] = useState('');
  const [eventType, setEventType] = useState<'Almuerzo' | 'Cena' | 'Coffee Break' | 'Coctel'>('Almuerzo');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [selectedMenuId, setSelectedMenuId] = useState(1);
  const [notes, setNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Transbank Webpay+');
  const [cardNumber, setCardNumber] = useState('4540 1234 5678 9012');
  const [cardHolder, setCardHolder] = useState('');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const selectedMenu = useMemo(() => {
    return menus.find(m => m.id === selectedMenuId) || menus[0];
  }, [menus, selectedMenuId]);

  // Gastronomic Ingredient calculations
  const calculatedIngredients = useMemo(() => {
    if (!selectedMenu || !selectedMenu.gramajeBaseDetalles) return [];
    try {
      const items = JSON.parse(selectedMenu.gramajeBaseDetalles);
      return items.map((ing: any) => {
        const rawTotal = ing.baseGrammage * guestCount;
        const totalWithMargin = rawTotal * 1.10; // 10% safety margin for waste
        
        let displayQuantity = totalWithMargin;
        let displayUnit = ing.unit;
        
        if (ing.unit === 'g' && totalWithMargin >= 1000) {
          displayQuantity = totalWithMargin / 1000;
          displayUnit = 'kg';
        } else if (ing.unit === 'ml' && totalWithMargin >= 1000) {
          displayQuantity = totalWithMargin / 1000;
          displayUnit = 'L';
        }

        return {
          name: ing.name,
          totalQuantity: Math.round(displayQuantity * 100) / 100,
          unit: displayUnit,
          baseQuantity: Math.round(rawTotal * 100) / 100,
          originalUnit: ing.unit
        };
      });
    } catch (e) {
      return [];
    }
  }, [selectedMenu, guestCount]);

  const estimatedCost = useMemo(() => {
    if (!selectedMenu) return 0;
    return guestCount * selectedMenu.precioPorPersona;
  }, [guestCount, selectedMenu]);

  const handleNext = () => {
    if (step === 1) {
      if (!nombre.trim() || !nombreEmpresa.trim() || !email.trim() || !telefono.trim() || !nombreEvento.trim() || !location.trim()) {
        alert('Por favor complete todos los campos obligatorios del cliente y ubicación.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handlePayAndSubmit = () => {
    if (!cardHolder.trim()) {
      alert('Por favor ingrese el nombre del titular de la tarjeta.');
      return;
    }
    setPaying(true);
    // Simulate transbank API response redirection
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      
      const newEvent: Omit<EventRequest, 'id'> = {
        nombre: nombreEvento.trim(),
        tipoEvento: eventType,
        fechaEvento: eventDate,
        ubicacion: location.trim(),
        cantidadAsistentes: guestCount,
        estado: 'PLANIFICADO', // Once paid, event auto-approves to planning state
        costoEstimado: estimatedCost,
        notas: notes.trim(),
        cliente: {
          id: Math.floor(Math.random() * 1000) + 1,
          nombre: nombre.trim(),
          nombreEmpresa: nombreEmpresa.trim(),
          email: email.trim(),
          telefono: telefono.trim()
        },
        menu: selectedMenu
      };
      
      onSubmit(newEvent, {
        method: paymentMethod,
        transId: 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      
      // Reset wizard
      setTimeout(() => {
        setStep(1);
        setNombre('');
        setNombreEmpresa('');
        setEmail('');
        setTelefono('');
        setNombreEvento('');
        setLocation('');
        setNotes('');
        setCardHolder('');
        setPaid(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Utensils className="text-emerald-500 w-6 h-6" />
            Portal Web de Cotizaciones y Pagos
          </h2>
          <p className="text-slate-400 text-sm mt-1">Cotiza banquetes corporativos e integra pagos con Transbank Webpay Plus.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
          <span className={step >= 1 ? "text-emerald-400 font-bold" : "text-slate-500"}>1. Cotizar</span>
          <span className="text-slate-700">&rarr;</span>
          <span className={step >= 2 ? "text-emerald-400 font-bold" : "text-slate-500"}>2. Menú</span>
          <span className="text-slate-700">&rarr;</span>
          <span className={step >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}>3. Resumen</span>
          <span className="text-slate-700">&rarr;</span>
          <span className={step >= 4 ? "text-emerald-400 font-bold" : "text-slate-500"}>4. Pagar</span>
        </div>
      </div>

      {paid ? (
        <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
            <ShieldCheck className="w-8 h-8 text-emerald-400 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-white">¡Pago Procesado Exitosamente!</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            La transacción de Transbank Webpay Plus ha sido aprobada. Su banquete fue derivado al Panel del Supervisor de Operaciones.
          </p>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 max-w-xs mx-auto font-mono text-left text-xs space-y-1 text-slate-400">
            <div><span className="text-slate-500">Orden de Compra:</span> OC_{Math.floor(Math.random()*90000)+10000}</div>
            <div><span className="text-slate-500">Pasarela:</span> {paymentMethod}</div>
            <div><span className="text-slate-500">Código de Aut.:</span> AUTH_{Math.floor(Math.random()*9000)+1000}</div>
            <div><span className="text-slate-500">Estado:</span> APROBADO (Código 0)</div>
          </div>
        </div>
      ) : paying ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">Conectando con Servidores de Transbank Webpay Plus...</h4>
          <p className="text-xs text-slate-500">Por favor, no cierre esta ventana.</p>
        </div>
      ) : (
        <>
          {/* Step 1: Request Quote */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">1. Datos de Contacto y Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Nombre del Solicitante *</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Empresa / Razón Social *</label>
                  <input
                    type="text"
                    placeholder="Ej. Google Chile"
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Correo Electrónico Corporativo *</label>
                  <input
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Teléfono de Contacto *</label>
                  <input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>

                <div className="md:col-span-2 border-t border-slate-800/60 pt-4 mt-2" />

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Nombre del Evento *</label>
                  <input
                    type="text"
                    placeholder="Ej. Aniversario Corporativo 2026"
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Tipo de Evento</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
                  >
                    <option value="Almuerzo">Almuerzo Buffet</option>
                    <option value="Cena">Cena de Gala</option>
                    <option value="Coffee Break">Coffee Break Ejecutivo</option>
                    <option value="Coctel">Coctel Sunset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Fecha Planificada</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Cantidad de Asistentes</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      min="10"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(10, parseInt(e.target.value) || 0))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Dirección / Lugar del Evento *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Ej. Hotel W Santiago, Las Condes"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Menus & Portion Calculation */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">2. Selección del Menú e Ingredientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => setSelectedMenuId(menu.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMenuId === menu.id
                        ? 'bg-emerald-950/20 border-emerald-500 shadow-lg'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm">{menu.nombre}</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          ${menu.precioPorPersona} USD/pers.
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1">{menu.descripcion}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span className="text-slate-500 text-[10px]">Total Estimado: ${menu.precioPorPersona * guestCount} USD</span>
                      <span>{selectedMenuId === menu.id ? 'Seleccionado ✓' : 'Seleccionar'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Portion Math */}
              <div className="bg-slate-955 border border-slate-850 p-5 rounded-xl">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500 w-4 h-4" />
                  Motor de Cálculos Gastronómicos (+10% Merma de Seguridad)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {calculatedIngredients.map((ing, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                      <div className="text-[10px] font-semibold text-slate-400 truncate" title={ing.name}>
                        {ing.name}
                      </div>
                      <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">
                        {ing.totalQuantity} <span className="text-[10px] font-normal text-slate-500">{ing.unit}</span>
                      </div>
                      <div className="text-[8px] text-slate-500 font-mono mt-0.5">
                        Base: {ing.baseQuantity} {ing.originalUnit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Logistics staffing and summary */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">3. Cotización y Proyección Logística</h3>
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 uppercase font-bold">Resumen de Cotización</span>
                  <span className="text-emerald-400 font-bold text-sm">Estado: PENDIENTE PAGO</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Cliente Corporativo</span>
                    <span className="text-white font-bold">{nombreEmpresa} ({nombre})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ubicación</span>
                    <span className="text-white font-medium">{location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fecha y Hora</span>
                    <span className="text-white font-mono">{eventDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Número de Invitados</span>
                    <span className="text-white font-bold">{guestCount} asistentes</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500 block">Menú Seleccionado</span>
                    <span className="text-emerald-400 font-bold">{selectedMenu.nombre}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Dotación Staff Sugerido</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {Math.ceil(guestCount / 15)} Garzones • {Math.ceil(guestCount / 40)} Chefs • 1 Supervisor
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total a Pagar</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">${estimatedCost.toLocaleString()} USD</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Requerimientos / Preferencias Alimentarias</label>
                <textarea
                  placeholder="Por favor, detalle alergias, opciones vegetarianas o especificaciones de montaje..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>
          )}

          {/* Step 4: Checkout Payments (Transbank) */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                4. Pasarela de Pagos Segura (Transbank Webpay Plus)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual Card simulator */}
                <div className="md:col-span-5 bg-gradient-to-br from-emerald-900/35 to-slate-950 border border-emerald-500/25 p-5 rounded-2xl flex flex-col justify-between shadow-xl min-h-48 relative overflow-hidden font-mono">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">WEBPAY PLUS</span>
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="space-y-4 my-4">
                    <div className="text-base text-white tracking-widest">{cardNumber}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {cardHolder || 'Titular de la Tarjeta'}
                    </div>
                  </div>
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-slate-500">Exp: 12/29</span>
                    <span className="text-emerald-400 font-bold font-mono">${estimatedCost.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-2">Método de Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none text-xs cursor-pointer"
                    >
                      <option value="Transbank Webpay+">Tarjetas de Crédito / Débito (Webpay Plus)</option>
                      <option value="Stripe">Stripe Checkout (Internacional)</option>
                      <option value="Transferencia">Transferencia Electrónica Directa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-2">Titular de la Tarjeta *</label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez Medina"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Sus datos están cifrados y se procesan bajo los más altos estándares PCI-DSS de forma segura por Transbank S.A.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Button controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-850">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-xl text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            ) : (
              <button
                onClick={onNavigateToDashboard}
                className="text-xs text-slate-400 hover:text-white transition-all underline cursor-pointer"
              >
                Ir al Panel Administrador
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl text-white font-semibold transition-all text-xs cursor-pointer ml-auto"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePayAndSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 rounded-xl text-slate-950 font-black transition-all text-xs cursor-pointer ml-auto shadow-lg shadow-emerald-950/20"
              >
                Confirmar y Pagar ${estimatedCost.toLocaleString()} USD <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
