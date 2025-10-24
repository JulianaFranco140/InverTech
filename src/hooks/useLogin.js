import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '../lib/tokenUtils';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      if (data.token) {
        setToken(data.token);
      } else {
      }

      if (data.user.rol_id === 1 || data.user.role === 1) {
        router.push('/entrepreneur');
      } else if (data.user.rol_id === 2 || data.user.role === 2) {
        router.push('/dashboard');
      } else {
        console.log(' Rol desconocido, redirigiendo a home');
        router.push('/');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}