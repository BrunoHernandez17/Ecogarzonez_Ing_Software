import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './views/LandingPage';
import Login from './views/Login';
import QuoteStepper from './components/QuoteStepper';
import AdminLayout from './views/Dashboard/AdminLayout';
import ClientQuotes from './views/ClientQuotes';
import { INITIAL_EVENTS } from './data/mockData';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [view, setView] = useState('landing');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [backendActive, setBackendActive] = useState(false);
  const { user, token, logout } = useAuth();

  // Helper to convert formatted UI ID (EVT-005) back to DB numeric ID (5)
  const getDbId = (id) => {
    if (typeof id === 'string') {
      const match = id.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    return id;
  };

  // Fetch events from backend database on load
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/eventos', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        // Map database numeric ID to UI string representations
        const mapped = data.map(evt => ({
          ...evt,
          id: `EVT-00${evt.id}`
        }));
        setEvents(mapped);
        setBackendActive(true);
        console.log('Connected to PostgreSQL through Spring Boot REST API.');
      }
    } catch (err) {
      console.warn('Backend API offline. Running in standalone local mock mode.', err);
      setBackendActive(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Quote Submission handler
  const handleSubmitQuote = async (newQuote) => {
    // 1. Local state update for immediate feedback
    setEvents(prev => [newQuote, ...prev]);

    // 2. Persist to database if backend is online
    try {
      const dbQuote = { ...newQuote };
      delete dbQuote.id; // Let database handle auto-increment ID

      const res = await fetch('http://localhost:8080/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbQuote)
      });
      if (res.ok) {
        // Refresh local events to align correct database generated IDs
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to submit quote to database.', err);
    }
  };

  // Admin actions: Accept event
  const handleAcceptEvent = async (id) => {
    // Local update
    setEvents(prev => 
      prev.map(evt => evt.id === id ? { ...evt, status: 'Aprobado', cost: Math.round(evt.totalPrice * 0.6) } : evt)
    );

    // Database update
    if (backendActive) {
      try {
        const dbId = getDbId(id);
        const res = await fetch(`http://localhost:8080/api/eventos/${dbId}/estado`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify('Aprobado')
        });
        if (res.ok) {
          fetchEvents();
        }
      } catch (err) {
        console.error('Failed to accept event in database.', err);
      }
    }
  };

  // Admin actions: Reject event
  const handleRejectEvent = async (id) => {
    // Local update
    setEvents(prev => 
      prev.map(evt => evt.id === id ? { ...evt, status: 'Rechazado' } : evt)
    );

    // Database update
    if (backendActive) {
      try {
        const dbId = getDbId(id);
        const res = await fetch(`http://localhost:8080/api/eventos/${dbId}/estado`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify('Rechazado')
        });
        if (res.ok) {
          fetchEvents();
        }
      } catch (err) {
        console.error('Failed to reject event in database.', err);
      }
    }
  };

  // Render correct view based on view state
  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <>
            <Navbar currentView={view} setView={setView} />
            {backendActive && (
              <div className="bg-green-950/40 text-green-400 border-b border-green-900/30 text-center py-2 text-xs font-semibold tracking-wider">
                ✓ Conectado a la API REST (Spring Boot + PostgreSQL)
              </div>
            )}
            <LandingPage setView={setView} />
            <Footer setView={setView} />
          </>
        );
      case 'cotizador':
        return (
          <>
            <Navbar currentView={view} setView={setView} />
            <div className="pt-24 min-h-[80vh] flex flex-col justify-center px-4">
              <QuoteStepper onSubmitQuote={handleSubmitQuote} setView={setView} />
            </div>
            <Footer setView={setView} />
          </>
        );
      case 'client-quotes':
        return (
          <>
            <Navbar currentView={view} setView={setView} />
            <div className="pt-24 min-h-[85vh]">
              <ClientQuotes events={events} setView={setView} />
            </div>
            <Footer setView={setView} />
          </>
        );
      case 'login':
        return <Login setView={setView} />;
      case 'dashboard':
        if (!user) {
           setView('login');
           return null;
        }
        return (
          <AdminLayout
            events={events}
            onAcceptEvent={handleAcceptEvent}
            onRejectEvent={handleRejectEvent}
            setView={setView}
            user={user}
            fetchEvents={fetchEvents}
          />
        );
      default:
        return (
          <>
            <Navbar currentView={view} setView={setView} />
            <LandingPage setView={setView} />
            <Footer setView={setView} />
          </>
        );
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-gray-200 min-h-screen">
      {renderView()}
    </div>
  );
}
