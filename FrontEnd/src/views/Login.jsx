import React, { useState } from 'react';
import { Mail, Lock, Shield, User, ChefHat, Coffee, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ setView }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('ADMIN');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        login(data.token, { nombre: data.nombre, rol: data.rol, email });
        setView('dashboard');
      } else {
        setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      console.error('Error logging in', err);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, rol })
      });
      
      if (res.ok) {
        setSuccessMsg('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        setIsRegister(false);
      } else {
        const errText = await res.text();
        setErrorMsg(errText || 'Error al crear la cuenta.');
      }
    } catch (err) {
      console.error('Error registering', err);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  const handleQuickLogin = (role) => {
    // For demo purposes, auto-fill credentials of default users depending on role
    const defaultCredentials = {
      'ADMIN': { e: 'admin@ecogarzones.cl', p: 'admin123' },
      'SUPERVISOR': { e: 'supervisor@ecogarzones.cl', p: 'sup123' },
      'CHEF': { e: 'chef@ecogarzones.cl', p: 'chef123' },
      'GARZON': { e: 'garzon@ecogarzones.cl', p: 'garzon123' }
    };
    
    if (role === 'CLIENT') {
      setView('landing');
      alert('Has ingresado a la vista de Cliente. ¡Puedes solicitar cotizaciones!');
      return;
    }
    
    const creds = defaultCredentials[role];
    if (creds) {
      setEmail(creds.e);
      setPassword(creds.p);
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] py-12 px-6 relative overflow-hidden">
      
      {/* Visual background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-dark/5 rounded-full filter blur-3xl -z-10" />

      {/* Login / Register Card */}
      <div className="w-full max-w-md glassmorphism p-8 rounded-xl shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span 
            onClick={() => setView('landing')}
            className="font-serif text-3xl text-gold italic tracking-wider cursor-pointer hover:text-gold-light transition-colors"
          >
            Ecogarzones
          </span>
          <h2 className="font-serif text-xl text-white italic">
            {isRegister ? 'Crear una Cuenta' : 'Acceso a la Plataforma'}
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            {isRegister ? 'Completa tus datos para registrarte' : 'Ingresa tus credenciales de usuario'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="space-y-5">
          
          {isRegister && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-gold transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Rol</label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-gold transition-colors duration-300 appearance-none"
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="CHEF">Chef</option>
                    <option value="GARZON">Garzón</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                required
                placeholder="correo@ejemplo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-gold transition-colors duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Contraseña</label>
              {!isRegister && (
                <a href="#" className="text-[10px] text-gold hover:text-gold-light transition-colors font-medium">¿La olvidaste?</a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-gold transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-dark to-gold text-black font-semibold text-xs tracking-widest uppercase py-3 rounded-lg hover:from-gold hover:to-gold-light transition-all duration-300 shadow-md shadow-gold/10"
          >
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gold hover:text-gold-light transition-colors"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2 mt-4">
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs flex items-center gap-2 mt-4">
            <Shield size={14} />
            {successMsg}
          </div>
        )}

        {/* Separator */}
        <div className="relative flex py-2 items-center mt-4">
          <div className="flex-grow border-t border-gray-900"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-600 uppercase tracking-widest">Credenciales Rápidas</span>
          <div className="flex-grow border-t border-gray-900"></div>
        </div>

        {/* Mock Roles buttons for easy testing */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gold/20 hover:border-gold bg-gold/5 text-gold hover:bg-gold/10 transition-all duration-300"
          >
            <Shield size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Administrador</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleQuickLogin('SUPERVISOR')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-blue-800/40 hover:border-blue-500 bg-blue-900/10 text-blue-400 hover:bg-blue-900/20 transition-all duration-300"
          >
            <User size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Supervisor</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('CHEF')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-orange-800/40 hover:border-orange-500 bg-orange-900/10 text-orange-400 hover:bg-orange-900/20 transition-all duration-300"
          >
            <ChefHat size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Chef</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('GARZON')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-800 hover:border-gray-600 bg-white/[0.02] text-gray-400 hover:text-white transition-all duration-300"
          >
            <Coffee size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Garzón</span>
          </button>
        </div>

        {/* Footer info link */}
        <div className="text-center mt-6">
          <button 
            onClick={() => setView('landing')} 
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            ← Volver al Inicio
          </button>
        </div>

      </div>
    </div>
  );
}
