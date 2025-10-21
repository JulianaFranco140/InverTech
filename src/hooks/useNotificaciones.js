import { useState } from 'react';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotificaciones = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setNotificaciones([]);
        return;
      }

      const response = await fetch('/api/notificaciones', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data.solicitudes || []);
      } else {
        setNotificaciones([]);
        setError('Error al cargar solicitudes');
      }
    } catch (error) {
      setNotificaciones([]);
      setError('Error de conexión');
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