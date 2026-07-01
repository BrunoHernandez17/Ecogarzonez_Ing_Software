import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, User } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', view: 'landing' },
    { label: 'Cotizador', view: 'cotizador' },
    { label: 'Mis Cotizaciones', view: 'client-quotes' },
  ];

  const handleNavClick = (view) => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0A0A0A]/95 border-b border-gold/10 shadow-lg py-4 backdrop-blur-md'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo/Brand */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="cursor-pointer group flex items-center gap-2"
        >
          <span className="font-serif text-2xl lg:text-3xl text-gold group-hover:text-gold-light transition-colors duration-300 italic tracking-wider">
            Ecogarzones
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                currentView === link.view
                  ? 'text-gold font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <button
            onClick={() => handleNavClick('login')}
            className={`flex items-center gap-1.5 text-sm tracking-wider uppercase transition-colors duration-300 ${
              currentView === 'login' || currentView === 'dashboard'
                ? 'text-gold font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User size={16} />
            <span>Portal</span>
          </button>

          <button
            onClick={() => handleNavClick('cotizador')}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-dark to-gold text-black font-semibold text-xs tracking-widest uppercase px-6 py-2.5 rounded-full hover:from-gold hover:to-gold-light transition-all duration-300 shadow-md shadow-gold/10 hover:shadow-gold/20 transform hover:-translate-y-0.5"
          >
            <Calendar size={14} />
            <span>Cotizar Online</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed top-[72px] right-0 bottom-0 w-80 bg-[#0C0C0C]/98 border-l border-gold/10 z-40 transition-transform duration-500 transform py-8 px-6 backdrop-blur-lg ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={`text-left text-lg font-serif italic tracking-wider py-2 border-b border-gray-800 ${
                currentView === link.view ? 'text-gold font-semibold' : 'text-gray-300'
              }`}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => handleNavClick('login')}
            className={`flex items-center gap-2 text-left text-lg font-serif italic tracking-wider py-2 border-b border-gray-800 ${
              currentView === 'login' || currentView === 'dashboard' ? 'text-gold font-semibold' : 'text-gray-300'
            }`}
          >
            <User size={18} className="text-gold" />
            <span>Portal de Acceso</span>
          </button>

          <button
            onClick={() => handleNavClick('cotizador')}
            className="mt-4 flex items-center justify-center gap-2 bg-gold text-black font-serif italic font-semibold text-md py-3 rounded-full hover:bg-gold-light transition-all duration-300 w-full"
          >
            <Calendar size={16} />
            <span>Cotizar Online</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
