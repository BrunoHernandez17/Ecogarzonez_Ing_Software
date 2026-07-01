import React from 'react';
import { Calendar, Users, BarChart3, LogOut, ChevronRight, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, setView }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.rol) {
      case 'ADMIN':
        return [
          { id: 'eventos', label: 'Eventos (Cotizaciones)', icon: Calendar },
          { id: 'logistica', label: 'Logística (Staff)', icon: Users },
          { id: 'finanzas', label: 'Finanzas', icon: BarChart3 }
        ];
      case 'SUPERVISOR':
        return [
          { id: 'eventos', label: 'Eventos (Cotizaciones)', icon: Calendar },
          { id: 'logistica', label: 'Asignar Tareas', icon: Users }
        ];
      case 'CHEF':
      case 'GARZON':
        return [
          { id: 'tareas', label: 'Mis Tareas', icon: CheckSquare }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-80 bg-[#0C0C0C] border-r border-gold/10 flex flex-col h-screen shrink-0">
      {/* Brand area */}
      <div className="p-8 border-b border-gold/10 flex items-center justify-between">
        <span className="font-serif text-2xl text-gold italic tracking-wider">
          Ecogarzones
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
          {user.rol}
        </span>
      </div>

      {/* Profile info */}
      <div className="p-6 border-b border-gold/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
          {user.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US'}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{user.nombre}</span>
          <span className="text-xs text-gray-500 capitalize">{user.rol.toLowerCase()}</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-300 ${isActive
                ? 'bg-gold/10 text-gold border-l-2 border-gold font-medium'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-gold' : 'text-gray-400'} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-gold' : 'text-gray-600'}`} />
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-gold/10">
        <button
          onClick={() => {
            logout();
            setView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full flex items-center justify-center gap-2 border border-gray-800 hover:border-red-900/30 hover:bg-red-950/10 text-gray-400 hover:text-red-400 text-sm py-2.5 rounded-lg transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
