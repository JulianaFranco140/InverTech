'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute - user:', user, 'isLoading:', isLoading, 'requiredRole:', requiredRole);
    
    if (!isLoading) {
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        router.push('/login');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        console.log(`❌ Invalid role. User role: ${user.role}, Required: ${requiredRole}`);
        
        // Redirigir al dashboard correcto según el rol del usuario
        if (user.role === 1) {
          console.log('➡️ Redirecting entrepreneur to /entrepreneur');
          router.push('/entrepreneur');
        } else if (user.role === 2) {
          console.log('➡️ Redirecting investor to /dashboard');
          router.push('/dashboard');
        } else {
          console.log('➡️ Unknown role, redirecting to home');
          router.push('/');
        }
        return;
      }

      console.log('✅ User authenticated and authorized, allowing access');
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#64748b' }}>Verificando autorización...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null; // Se está redirigiendo
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <p style={{ color: '#64748b' }}>Redirigiendo al dashboard correcto...</p>
      </div>
    );
  }

  return children;
}