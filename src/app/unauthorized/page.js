'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1> Acceso No Autorizado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <div className={styles.actions}>
          <button onClick={() => router.push('/login')} className={styles.loginBtn}>
            Ir al Login
          </button>
          <button onClick={() => router.push('/')} className={styles.homeBtn}>
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}