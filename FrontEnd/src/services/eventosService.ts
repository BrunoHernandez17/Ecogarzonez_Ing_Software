import { supabase } from '../lib/supabase';

/**
 * Obtiene todos los eventos activos desde la tabla 'ms_evento'.
 */
export async function obtenerEventosActivos() {
  const { data, error } = await supabase
    .from('ms_evento')
    .select('*');
    
  if (error) {
    console.error('Error al obtener eventos activos:', error.message);
    throw error;
  }
  return data;
}

/**
 * Crea una nueva solicitud de banquete/evento en la tabla 'ms_evento'.
 * Debe incluir el id_cliente para la correcta vinculación relacional.
 * 
 * @param datos Datos del evento que se desean registrar
 */
export async function crearSolicitudEvento(datos: any) {
  const { data, error } = await supabase
    .from('ms_evento')
    .insert([datos])
    .select();

  if (error) {
    console.error('Error al registrar la solicitud de evento:', error.message);
    throw error;
  }
  return data;
}

/**
 * Obtiene el listado de personal de la tabla 'ms_staff' que esté disponible.
 * Filtra los registros donde la columna 'disponibilidad' sea verdadera (true).
 */
export async function obtenerStaffDisponible() {
  const { data, error } = await supabase
    .from('ms_staff')
    .select('*')
    .eq('disponibilidad', true);

  if (error) {
    console.error('Error al obtener staff disponible:', error.message);
    throw error;
  }
  return data;
}
