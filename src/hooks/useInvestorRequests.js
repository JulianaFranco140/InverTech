import { useState } from 'react';
import { createAuthHeaders, handleTokenError } from '../lib/tokenUtils';

export function useInvestorRequests() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    pendientes: 0,
    revision: 0,
    proceso: 0,
    aceptadas: 0,
    rechazadas: 0
  });

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/investor-requests', {
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
      console.error('❌ Fetch error:', error);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarEstado = async (solicitudId, nuevoEstado) => {
    try {
      setError(null);

      const response = await fetch(`/api/investor-requests/${solicitudId}`, {
        method: 'PATCH',
        headers: {
          ...createAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        const result = await response.json();
        
        setSolicitudes(prev => 
          prev.map(s => 
            s.id === solicitudId 
              ? { ...s, estado: nuevoEstado, estadoInfo: getEstadoInfo(nuevoEstado) }
              : s
          )
        );
        
        setSolicitudes(prevSolicitudes => {
          const nuevasSolicitudes = prevSolicitudes.map(s => 
            s.id === solicitudId 
              ? { ...s, estado: nuevoEstado, estadoInfo: getEstadoInfo(nuevoEstado) }
              : s
          );
          
          const nuevasEstadisticas = {
            pendientes: nuevasSolicitudes.filter(s => s.estado === 'pendiente').length,
            revision: nuevasSolicitudes.filter(s => s.estado === 'revision').length,
            proceso: nuevasSolicitudes.filter(s => s.estado === 'proceso').length,
            aceptadas: nuevasSolicitudes.filter(s => s.estado === 'aceptada').length,
            rechazadas: nuevasSolicitudes.filter(s => s.estado === 'rechazada').length
          };
          setEstadisticas(nuevasEstadisticas);
          
          return nuevasSolicitudes;
        });

        return { 
          success: true, 
          message: result.message || 'Estado actualizado exitosamente'
        };
      } else if (response.status === 401) {
        handleTokenError();
        throw new Error('Sesión expirada');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      setError(error.message);
      throw error;
    }
  };

  const getEstadoInfo = (estado) => {
    const estadoMap = {
      'pendiente': { label: 'Pendiente', color: 'warning' },
      'revision': { label: 'En Revisión', color: 'info' },
      'proceso': { label: 'En Proceso', color: 'primary' },
      'aceptada': { label: 'Aceptada', color: 'success' },
      'rechazada': { label: 'Rechazada', color: 'danger' }
    };
    return estadoMap[estado] || { label: estado, color: 'secondary' };
  };

  return {
    solicitudes,
    estadisticas,
    isLoading,
    error,
    fetchSolicitudes,
    actualizarEstado
  };
}