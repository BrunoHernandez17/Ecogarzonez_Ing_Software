import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Eventos from './Eventos';
import Logistica from './Logistica';
import Finanzas from './Finanzas';
import TareasStaff from './TareasStaff';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ 
  events, 
  onAcceptEvent, 
  onRejectEvent, 
  onAssignStaff, 
  onRemoveStaff, 
  setView 
}) {
  const { user } = useAuth();
  
  // Set default tab based on role
  const getDefaultTab = () => {
    if (!user) return 'eventos';
    if (user.rol === 'ADMIN' || user.rol === 'SUPERVISOR') return 'eventos';
    if (['CHEF', 'GARZON', 'ASEO', 'BARTENDER'].includes(user.rol)) return 'tareas';
    return 'eventos';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex bg-[#0A0A0A] min-h-screen text-gray-200">
      
      {/* Mobile Sidebar overlay toggles */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#0C0C0C] border border-gold/25 rounded-lg text-gold hover:text-white transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Desktop (always visible) and Mobile drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform lg:relative lg:transform-none transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }} 
          setView={setView} 
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto overflow-y-auto mt-12 lg:mt-0 w-full">
        {activeTab === 'eventos' && (user.rol === 'ADMIN' || user.rol === 'SUPERVISOR') && (
          <Eventos 
            events={events} 
            onAcceptEvent={onAcceptEvent} 
            onRejectEvent={onRejectEvent}
            isSupervisor={user.rol === 'SUPERVISOR'} 
          />
        )}
        {activeTab === 'logistica' && (user.rol === 'ADMIN' || user.rol === 'SUPERVISOR') && (
          <Logistica 
            events={events} 
            onAssignStaff={onAssignStaff} 
            onRemoveStaff={onRemoveStaff} 
          />
        )}
        {activeTab === 'finanzas' && user.rol === 'ADMIN' && (
          <Finanzas 
            events={events} 
          />
        )}
        {activeTab === 'tareas' && (['CHEF', 'GARZON', 'ASEO', 'BARTENDER'].includes(user.rol)) && (
          <TareasStaff />
        )}
      </main>

    </div>
  );
}
