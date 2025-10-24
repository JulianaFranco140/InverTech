'use client';

import { useState, useEffect } from 'react';
import { createAuthHeaders, getToken, handleTokenError } from '../lib/tokenUtils';

export function useEmprendimientos() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  const fetchEmprendimientos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('/api/emprendimientos', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          return handleTokenError();
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar emprendimientos');
      }

      const data = await response.json();
      setEmprendimientos(data.emprendimientos || []);
      
    } catch (err) {
      console.error('Error fetching emprendimientos:', err);
      setError(err.message);
      setEmprendimientos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmprendimiento = async (emprendimientoData) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('/api/emprendimientos', {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(emprendimientoData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          return handleTokenError();
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear emprendimiento');
      }

      const data = await response.json();
      
      setEmprendimientos(prev => [...prev, data.emprendimiento]);
      
      return data.emprendimiento;
      
    } catch (err) {
      console.error('Error creating emprendimiento:', err);
      throw err;
    }
  };

  const deleteEmprendimiento = async (id) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`/api/emprendimientos/${id}`, {
        method: 'DELETE',
        headers: createAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          return handleTokenError();
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar emprendimiento');
      }

      setEmprendimientos(prev => prev.filter(emp => emp.id_emprendimiento !== id));
      
      return true;
      
    } catch (err) {
      console.error('Error deleting emprendimiento:', err);
      throw err;
    }
  };

  return {
    emprendimientos,
    isLoading,
    error,
    refetch: fetchEmprendimientos,
    createEmprendimiento,
    deleteEmprendimiento
  };
}