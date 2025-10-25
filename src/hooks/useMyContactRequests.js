import { useState } from 'react';
import { createAuthHeaders, handleTokenError } from '../lib/tokenUtils';

export function useMyContactRequests() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    pendientes: 0,
    enRevision: 0,
    enProceso: 0,
    aceptadas: 0,
    rechazadas: 0
  });

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my-contact-requests', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data.solicitudes || []);
        setEstadisticas(data.estadisticas || {});
      } else if (response.status === 401) {
        handleTokenError();
        setError('Sesión expirada');
      } else {
        const errorText = await response.text();
        setError(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error(' Fetch error:', error);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarSolicitud = async (solicitudId) => {
    try {
      setError(null);

      const response = await fetch(`/api/my-contact-requests/${solicitudId}`, {
        method: 'DELETE',
        headers: createAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        
        setSolicitudes(prev => {
          const nuevasSolicitudes = prev.filter(s => s.id !== solicitudId);
          
          const nuevasEstadisticas = {
            pendientes: nuevasSolicitudes.filter(s => s.estado === 'pendiente').length,
            enRevision: nuevasSolicitudes.filter(s => s.estado === 'revision').length,
            enProceso: nuevasSolicitudes.filter(s => s.estado === 'proceso').length,
            aceptadas: nuevasSolicitudes.filter(s => s.estado === 'aceptada').length,
            rechazadas: nuevasSolicitudes.filter(s => s.estado === 'rechazada').length
          };
          setEstadisticas(nuevasEstadisticas);
          
          return nuevasSolicitudes;
        });

        return { 
          success: true, 
          message: result.message || 'Solicitud eliminada exitosamente'
        };
      } else if (response.status === 401) {
        handleTokenError();
        throw new Error('Sesión expirada');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar solicitud');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    solicitudes,
    estadisticas,
    isLoading,
    error,
    fetchSolicitudes,
    eliminarSolicitud
  };
}