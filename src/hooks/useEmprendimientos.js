import { useState, useEffect } from 'react';

export function useEmprendimientos(shouldFetch = true) {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener emprendimientos
  const fetchEmprendimientos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/emprendimientos');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener emprendimientos');
      }

      const data = await response.json();
      setEmprendimientos(data.emprendimientos || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching emprendimientos:', err);
      setError(err.message);
      setEmprendimientos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo emprendimiento
  const createEmprendimiento = async (emprendimientoData) => {
    try {
      const response = await fetch('/api/emprendimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emprendimientoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear emprendimiento');
      }

      const data = await response.json();
      
      // Actualizar la lista local
      setEmprendimientos(prev => [data.emprendimiento, ...prev]);
      
      return data.emprendimiento;
    } catch (err) {
      console.error('Error creating emprendimiento:', err);
      throw err;
    }
  };

  // Eliminar emprendimiento
  const deleteEmprendimiento = async (id) => {
    try {
      const response = await fetch(`/api/emprendimientos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar emprendimiento');
      }

      // Actualizar la lista local
      setEmprendimientos(prev => prev.filter(emp => emp.id_emprendimiento !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting emprendimiento:', err);
      throw err;
    }
  };

  // CAMBIO: Solo hacer fetch si shouldFetch es true
  useEffect(() => {
    if (shouldFetch) {
      fetchEmprendimientos();
    } else {
      setIsLoading(false);
    }
  }, [shouldFetch]);

  return {
    emprendimientos,
    isLoading,
    error,
    createEmprendimiento,
    deleteEmprendimiento,
    refetch: fetchEmprendimientos
  };
}