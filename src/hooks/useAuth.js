'use client';

import { useState, useEffect } from 'react';
import { getToken, setToken, removeToken, isTokenValid, getTokenPayload } from '../lib/tokenUtils';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 useAuth useEffect ejecutándose...');
    
    const token = getToken();
    console.log('🎫 Token encontrado en localStorage:', !!token);
    console.log('🎫 Token completo:', token);
    
    if (token && isTokenValid(token)) {
      const decodedToken = getTokenPayload(token);
      console.log('🔓 Token decodificado:', decodedToken);

      if (decodedToken) {
        const userData = {
          id: decodedToken.userId,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role
        };
        console.log('👤 Estableciendo usuario:', userData);
        setUser(userData);
      } else {
        console.log('⚠️ Token inválido');
        removeToken();
        setUser(null);
      }
    } else {
      console.log('❌ No se encontró token válido en localStorage');
      if (token) removeToken(); // Limpiar token expirado
      setUser(null);
    }
    
    console.log('✅ useAuth useEffect terminado, isLoading -> false');
    setIsLoading(false);
  }, []);

    const logout = async () => {
    console.log('🚪 Iniciando logout...');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setUser(null);
    removeToken();
    console.log('✅ User logged out, redirecting to home page.');
    window.location.href = '/';
  };

  console.log('🔄 useAuth rendering - user:', user, 'isLoading:', isLoading);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}

export function getAuthToken() {
  return getToken();
}