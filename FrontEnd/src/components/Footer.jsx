import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="bg-[#050505] border-t border-gold/10 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-900">
        
        {/* Col 1: About */}
        <div className="flex flex-col gap-4">
          <span 
            onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-serif text-3xl text-gold italic tracking-wider cursor-pointer hover:text-gold-light transition-colors duration-300"
          >
            Ecogarzones
          </span>
          <p className="text-sm leading-relaxed text-gray-500">
            Cinco años creando experiencias culinarias extraordinarias y logística de servicio impecable para los eventos más exclusivos de la Región de Valparaíso y Metropolitana.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-gold transition-colors duration-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-300">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Col 2: Services / Navigation */}
        <div className="flex flex-col gap-4 md:pl-10">
          <h3 className="font-serif text-lg text-white italic tracking-wider">Enlaces</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <button 
                onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-gold transition-colors duration-300 text-left"
              >
                Inicio
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setView('cotizador'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-gold transition-colors duration-300 text-left"
              >
                Cotizador Online
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-gold transition-colors duration-300 text-left"
              >
                Portal de Administración
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg text-white italic tracking-wider">Contacto</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-gold shrink-0" />
              <span>Av. Libertad 1230, Viña del Mar, Chile</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold shrink-0" />
              <span>+56 9 8137 7642</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-gold shrink-0" />
              <span>contacto@ecogarzones.cl</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-gold shrink-0" />
              <span>Lun - Sáb: 09:00 - 19:00</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Ecogarzones Banquetería. Todos los derechos reservados.</p>
        <p>Diseño Elegante y Minimalista inspirado en los estándares de alta gama.</p>
      </div>
    </footer>
  );
}
