import { useState } from 'react';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotificaciones = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Fetching notificaciones sin token...');

      const response = await fetch('/api/notificaciones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Data received:', data);
        setNotificaciones(data.solicitudes || []);
      } else {
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