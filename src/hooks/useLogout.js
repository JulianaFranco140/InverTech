'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthHeaders, removeToken } from '../lib/tokenUtils';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: createAuthHeaders(),
      });
      removeToken(); // Limpiar token después del logout
      router.push('/');
    } catch (err) {
      console.error('Error during logout:', err);
      removeToken(); // Limpiar token aunque haya error
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}