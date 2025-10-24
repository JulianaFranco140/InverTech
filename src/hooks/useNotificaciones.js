import { useState } from 'react';
import { createAuthHeaders, handleTokenError } from '../lib/tokenUtils';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotificaciones = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Fetching notificaciones...');

      const response = await fetch('/api/notificaciones', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Data received:', data);
        setNotificaciones(data.solicitudes || []);
      } else {
        if (response.status === 401) {
          return handleTokenError();
        }
        const errorText = await response.text();
        console.error('❌ Error response:', response.status, errorText);
        setNotificaciones([]);
        setError(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setNotificaciones([]);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notificaciones,
    isLoading,
    error,
    fetchNotificaciones
  };
}