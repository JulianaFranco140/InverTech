'use client';

import { useState, useEffect } from 'react';

function getLocalStorageToken() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('auth-token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
}

function setLocalStorageToken(token) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('auth-token', token);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

function removeLocalStorageToken() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('auth-token');
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
}

function decodeJWT(token) {
  console.log('🔓 Decoding JWT:', token);
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    console.log('✅ Decoded JWT payload:', payload);
    return payload;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 useAuth useEffect ejecutándose...');
    
    const token = getLocalStorageToken();
    console.log('🎫 Token encontrado en localStorage:', !!token);
    console.log('🎫 Token completo:', token);
    
    if (token) {
      const decodedToken = decodeJWT(token);
      console.log('🔓 Token decodificado:', decodedToken);

      if (decodedToken && decodedToken.exp > Date.now() / 1000) {
        const userData = {
          id: decodedToken.userId,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role
        };
        console.log('👤 Estableciendo usuario:', userData);
        setUser(userData);
      } else {
        console.log('⚠️ Token expirado o inválido');
        removeLocalStorageToken();
        setUser(null);
      }
    } else {
      console.log('❌ No se encontró token en localStorage');
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
          'Authorization': `Bearer ${getLocalStorageToken()}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setUser(null);
    removeLocalStorageToken();
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
  return getLocalStorageToken();
}