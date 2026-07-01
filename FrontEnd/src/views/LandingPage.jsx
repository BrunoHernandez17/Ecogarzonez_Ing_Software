import React from 'react';
import { Calendar, ShieldCheck, Award, Star } from 'lucide-react';
import heroImg from '../assets/luxury_banquet_hero.png';
import dessertImg from '../assets/gourmet_dessert.png';
import cocktailImg from '../assets/corporate_cocktail.png';

export default function LandingPage({ setView }) {
  return (
    <div className="space-y-24 bg-[#0A0A0A] text-gray-200">
      
      {/* 1. Hero Section */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with sophisticated dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Luxury Banquet Hero"
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/25 backdrop-blur-xs">
            Banquetería & Producción Exclusiva
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white font-normal italic tracking-wide leading-tight">
            Ecogarzones
          </h1>
          
          <p className="text-md md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto font-sans">
            Creamos experiencias memorables fusionando alta gastronomía, coctelería de autor y una logística de servicio impecable.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => {
                setView('cotizador');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-black font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-gold/25 transform hover:-translate-y-0.5"
            >
              Cotizar Mi Evento
            </button>
            <button
              onClick={() => {
                const sec = document.getElementById('servicios');
                if (sec) sec.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/20 hover:border-white text-white font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300"
            >
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Scroll indicator mouse */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10">
          <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold rounded-full animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-500">Deslizar</span>
        </div>
      </header>

      {/* 2. Brand Statement */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-4">
        <span className="font-serif text-gold text-lg md:text-xl italic">El Arte del Buen Servir</span>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal italic tracking-wide">
          Una Experiencia Gastronómica Sin Precedentes
        </h2>
        <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          Nos apasiona el detalle. Desde matrimonios íntimos hasta cenas corporativas de gran escala, coordinamos cada aspecto de la gastronomía y la dotación de personal para asegurar el éxito rotundo de tu celebración.
        </p>
      </section>

      {/* 3. Services Showcase Section */}
      <section id="servicios" className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">Nuestra Propuesta</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-normal italic mt-1.5">Servicios de Banquetería Premium</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Card 1: Gastronomy */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Gastronomía de Vanguardia</span>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-normal italic">Platos Diseñados Para Cautivar</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nuestra cocina rescata los mejores ingredientes locales con técnicas contemporáneas. Ofrecemos alternativas de menús tradicionales, vegetarianos, veganos y preparaciones libres de gluten elaboradas bajo estrictas normas de seguridad alimentaria.
            </p>
            <div className="flex flex-col gap-3.5 text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-gold"><Star size={12} /></div>
                <span>Ingredientes orgánicos del valle central.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-gold"><Star size={12} /></div>
                <span>Menús equilibrados y personalizados por chefs expertos.</span>
              </div>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-xl border border-gold/10">
            <img
              src={dessertImg}
              alt="Gourmet Dessert"
              className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
          {/* Card 2: Bar & Logistics */}
          <div className="lg:order-2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Logística e Infraestructura</span>
            <h3 className="font-serif text-2xl md:text-3xl text-white font-normal italic">Servicio Impecable y Coctelería Fina</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Garantizamos que la barra sea el alma del evento con mixología fina y tragos tradicionales. Nuestro staff de garzones, bartenders y personal operativo está altamente capacitado bajo el sello de hospitalidad Ecogarzones.
            </p>
            <div className="flex flex-col gap-3.5 text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-gold"><Star size={12} /></div>
                <span>Barras libres interactivas y bartenders de autor.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-gold"><Star size={12} /></div>
                <span>Staff profesional y coordinadores en terreno.</span>
              </div>
            </div>
          </div>
          <div className="lg:order-1 relative group overflow-hidden rounded-xl border border-gold/10">
            <img
              src={cocktailImg}
              alt="Corporate Cocktail"
              className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
          </div>
        </div>
      </section>

      {/* 4. Experience metrics */}
      <section className="bg-[#050505] py-20 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <strong className="text-gold font-serif text-4xl lg:text-5xl italic font-normal block">5 Años</strong>
            <span className="text-xs uppercase tracking-widest text-gray-500">De Trayectoria Impecable</span>
          </div>
          <div className="space-y-2">
            <strong className="text-gold font-serif text-4xl lg:text-5xl italic font-normal block">500+</strong>
            <span className="text-xs uppercase tracking-widest text-gray-500">Eventos Realizados</span>
          </div>
          <div className="space-y-2">
            <strong className="text-gold font-serif text-4xl lg:text-5xl italic font-normal block">100%</strong>
            <span className="text-xs uppercase tracking-widest text-gray-500">Garantía de Satisfacción</span>
          </div>
        </div>
      </section>

      {/* 5. Booking call to action */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center space-y-6">
        <h2 className="font-serif text-3xl md:text-5xl text-white font-normal italic tracking-wide">
          ¿Comenzamos a planificar tu evento?
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Usa nuestro cotizador interactivo en línea para recibir un presupuesto estimado en tiempo real de forma inmediata.
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              setView('cotizador');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-black font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-gold/20"
          >
            Probar Cotizador
          </button>
        </div>
      </section>

    </div>
  );
}
