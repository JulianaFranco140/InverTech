'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      router.push('/');
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}