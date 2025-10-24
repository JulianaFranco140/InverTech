import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, removeToken } from '../lib/tokenUtils';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {

      removeToken();
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          throw new Error(data.details.join(', '));
        }
        throw new Error(data.error || 'Error en el registro');
      }

      if (data.token){
        setToken(data.token);
      }
      else{
        throw new Error('No se recibió token de autenticación');
      }


      await new Promise(resolve => setTimeout(resolve, 100));

      
      if (data.user.rol_id === 1) {
        router.push('/entrepreneur');
      } else {
        router.push('/dashboard');
      }

      return data;
    } catch (err) {
      console.error(' Error en registro:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}