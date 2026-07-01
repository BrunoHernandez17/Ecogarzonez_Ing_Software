import React, { useState, useEffect } from 'react';
import { Calendar, Users, Wine, UtensilsCrossed, ArrowRight, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { BAR_OPTIONS, EVENT_TYPES, formatCLP } from '../data/mockData';

export default function QuoteStepper({ onSubmitQuote, setView }) {
  const [step, setStep] = useState(1);
  const [minutas, setMinutas] = useState([]);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES[0].id);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(50);
  const [menuId, setMenuId] = useState(null);
  const [barId, setBarId] = useState(BAR_OPTIONS[0].id);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/minutas/aprobadas')
      .then(res => res.json())
      .then(data => {
        setMinutas(data);
        if (data.length > 0) setMenuId(data[0].id);
      })
      .catch(err => console.error("Error fetching minutas", err));
  }, []);

  // Calculations
  const selectedEventDetails = EVENT_TYPES.find(t => t.id === eventType);
  const selectedFoodDetails = minutas.find(m => m.id === menuId);
  const selectedBarDetails = BAR_OPTIONS.find(b => b.id === barId);

  const basePrice = selectedEventDetails?.basePrice || 0;
  const foodPrice = (selectedFoodDetails?.precioPorPersona || 0) * guests;
  const barPrice = (selectedBarDetails?.pricePerPerson || 0) * guests;
  const totalPrice = basePrice + foodPrice + barPrice;

  const handleNext = () => {
    if (step === 1) {
      if (!clientName || !clientEmail || !date) {
        alert('Por favor completa todos los campos requeridos del primer paso.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new event object
    const newQuote = {
      id: `EVT-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      clientEmail,
      eventType,
      date,
      guests: parseInt(guests, 10),
      minutaId: menuId,
      barId,
      totalPrice,
      cost: Math.round(totalPrice * 0.6), // mock 60% operating cost
      status: 'Pendiente',
      createdAt: new Date().toISOString().split('T')[0],
      assignedStaff: []
    };

    onSubmitQuote(newQuote);
    setSubmitted(true);
  };

  // Step Indicators Component
  const stepIndicators = [
    { num: 1, label: 'Detalles' },
    { num: 2, label: 'Banquete' },
    { num: 3, label: 'Barra' },
    { num: 4, label: 'Resumen' }
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto text-gold glow-gold">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="font-serif text-3xl text-white italic">¡Cotización Enviada Exitosamente!</h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Hemos recibido tu solicitud para el evento. Nuestro equipo comercial la revisará y se pondrá en contacto contigo a la brevedad. Puedes simular el estado de esta cotización ingresando al panel de administración.
        </p>
        <div className="pt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setClientName('');
              setClientEmail('');
              setDate('');
              setGuests(50);
            }}
            className="px-6 py-2.5 border border-gold text-gold hover:bg-gold/10 text-xs tracking-widest uppercase rounded-full transition-all duration-300"
          >
            Nueva Cotización
          </button>
          <button
            onClick={() => setView('landing')}
            className="px-6 py-2.5 bg-gold text-black hover:bg-gold-light text-xs tracking-widest uppercase rounded-full font-semibold transition-all duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#0C0C0C] border border-gold/15 rounded-xl shadow-2xl overflow-hidden my-12 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-[#050505] p-8 border-b border-gold/10 text-center">
        <h1 className="font-serif text-3xl text-white italic tracking-wide">Cotizador de Eventos</h1>
        <p className="text-xs uppercase tracking-widest text-gold mt-1.5 font-medium">Diseña una experiencia a tu medida</p>
      </div>

      {/* Stepper Progress */}
      <div className="px-8 py-6 bg-[#0E0E0E] border-b border-white/5 flex items-center justify-between">
        <div className="flex w-full items-center justify-between max-w-xl mx-auto">
          {stepIndicators.map((s, index) => (
            <React.Fragment key={s.num}>
              {/* Step circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border text-sm transition-all duration-300 ${
                    step === s.num
                      ? 'bg-gold text-black border-gold shadow-md shadow-gold/20'
                      : step > s.num
                      ? 'bg-gold/20 text-gold border-gold'
                      : 'bg-transparent text-gray-500 border-gray-800'
                  }`}
                >
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${step === s.num ? 'text-gold' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {/* Connector line */}
              {index < stepIndicators.length - 1 && (
                <div 
                  className={`flex-1 h-[2px] mx-4 transition-all duration-500 ${
                    step > s.num ? 'bg-gold' : 'bg-gray-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8 min-h-[400px] flex flex-col justify-between">
        
        {/* Step 1: Info & Event type */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="font-serif text-xl text-white italic flex items-center gap-2">
              <Calendar className="text-gold" size={20} />
              <span>Paso 1: Detalles del Evento</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Javiera Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="Ej: javiera@correo.cl"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-300"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold block flex items-center gap-1">
                    <span>Invitados</span>
                    <span className="text-gold">({guests})</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold transition-colors duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Food selections */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="font-serif text-xl text-white italic flex items-center gap-2">
              <UtensilsCrossed className="text-gold" size={20} />
              <span>Paso 2: Banquete y Gastronomía</span>
            </h2>
            <p className="text-xs text-gray-500 -mt-2 leading-relaxed">
              Selecciona la alternativa gastronómica que mejor se adapte a tus invitados. Todos los menús contemplan Entrada, Fondo y Postre.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {minutas.length === 0 && (
                <div className="col-span-2 text-center text-gray-400 text-sm py-8">
                  Cargando alternativas gastronómicas...
                </div>
              )}
              {minutas.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => setMenuId(menu.id)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    menuId === menu.id
                      ? 'bg-gold/5 border-gold shadow-md'
                      : 'bg-[#121212] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-md text-white font-medium italic">{menu.nombre}</h3>
                      <span className="text-gold text-xs font-semibold shrink-0">
                        {formatCLP(menu.precioPorPersona)} p/p
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{menu.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Drinks / Bar variety */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="font-serif text-xl text-white italic flex items-center gap-2">
              <Wine className="text-gold" size={20} />
              <span>Paso 3: Estación de Bar y Coctelería</span>
            </h2>

            <div className="space-y-4">
              {BAR_OPTIONS.map((bar) => (
                <div
                  key={bar.id}
                  onClick={() => setBarId(bar.id)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
                    barId === bar.id
                      ? 'bg-gold/5 border-gold shadow-md'
                      : 'bg-[#121212] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="font-serif text-md text-white font-medium italic">{bar.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{bar.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-gold text-sm font-semibold block">{formatCLP(bar.pricePerPerson)} p/p</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mt-0.5">Por invitado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Budget Breakdown and submit */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="font-serif text-xl text-white italic flex items-center gap-2">
              <CheckCircle2 className="text-gold" size={20} />
              <span>Paso 4: Confirmación y Presupuesto</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Event Details Summary */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-[#121212] p-6 rounded-lg border border-gray-800 space-y-4">
                  <h3 className="font-serif text-lg text-white italic border-b border-white/5 pb-2">Resumen de Selección</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                    <div>
                      <span className="uppercase text-[9px] tracking-wider text-gray-500 block">Nombre del Cliente</span>
                      <strong className="text-white text-sm block mt-0.5">{clientName}</strong>
                      <span className="text-[10px] mt-0.5 block">{clientEmail}</span>
                    </div>
                    <div>
                      <span className="uppercase text-[9px] tracking-wider text-gray-500 block">Tipo & Fecha</span>
                      <strong className="text-white text-sm block mt-0.5">{selectedEventDetails?.name}</strong>
                      <span className="text-[10px] mt-0.5 block">{date}</span>
                    </div>
                    <div className="col-span-2 border-t border-white/5 pt-3">
                      <span className="uppercase text-[9px] tracking-wider text-gray-500 block">Opción Gastronómica</span>
                      <strong className="text-white text-sm block mt-0.5">{selectedFoodDetails?.nombre}</strong>
                      <span className="text-[10px] mt-0.5 block italic text-gray-400">{selectedFoodDetails?.descripcion}</span>
                    </div>
                    <div className="col-span-2 border-t border-white/5 pt-3">
                      <span className="uppercase text-[9px] tracking-wider text-gray-500 block">Opción de Barra</span>
                      <strong className="text-white text-sm block mt-0.5">{selectedBarDetails?.name}</strong>
                      <span className="text-[10px] mt-0.5 block italic text-gray-400">{selectedBarDetails?.description}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total calculations panel */}
              <div className="bg-gradient-to-b from-[#181818] to-[#101010] p-6 rounded-lg border border-gold/20 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-gold italic border-b border-gold/10 pb-2">Presupuesto</h3>
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Costo Base:</span>
                      <span className="text-white">{formatCLP(basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Banquetería ({guests} p/p):</span>
                      <span className="text-white">{formatCLP(foodPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barra ({guests} p/p):</span>
                      <span className="text-white">{formatCLP(barPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800 space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Total Estimado</span>
                    <strong className="text-gold text-2xl lg:text-3xl font-bold block mt-1 tracking-wider">{formatCLP(totalPrice)}</strong>
                    <span className="text-[10px] text-gray-500 block mt-1">Valores netos expresados en CLP</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Buttons navigation */}
        <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-2 border border-gray-800 text-gray-300 hover:text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors duration-300"
            >
              <ArrowLeft size={14} />
              <span>Atrás</span>
            </button>
          ) : (
            <div></div> // empty spacer
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-white hover:bg-gray-150 text-black px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
            >
              <span>Continuar</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-gold-dark to-gold text-black hover:from-gold hover:to-gold-light px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-gold/20"
            >
              <span>Solicitar Cotización</span>
              <Check size={14} />
            </button>
          )}
        </div>

      </form>

    </div>
  );
}
