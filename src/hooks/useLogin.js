import { useState } from 'react';
import { useRouter } from 'next/navigation';

function setLocalStorageToken(token) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('auth-token', token);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Iniciando login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('📡 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // Guardar token en localStorage
      if (data.token) {
        setLocalStorageToken(data.token);
        console.log('✅ Token guardado en localStorage');
        console.log('🎫 Token guardado:', data.token.substring(0, 20) + '...'); // Solo mostrar parte del token
      } else {
        console.log('❌ No se recibió token en la respuesta');
      }

      // Redirigir según el rol
      if (data.user.rol_id === 1 || data.user.role === 1) {
        console.log('➡️ Redirigiendo a entrepreneur dashboard');
        router.push('/entrepreneur');
      } else if (data.user.rol_id === 2 || data.user.role === 2) {
        console.log('➡️ Redirigiendo a investor dashboard');
        router.push('/dashboard');
      } else {
        console.log('➡️ Rol desconocido, redirigiendo a home');
        router.push('/');
      }

      return data;
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}