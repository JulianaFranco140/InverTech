'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './EntrepreneurSidebar.module.css';
import { useLogout } from '../hooks/useLogout';

export default function EntrepreneurSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: '', href: '/entrepreneur' },
    { name: 'Mis Proyectos', icon: '', href: '/entrepreneur/project' },,
    { name: 'Mis solicitudes', icon: '', href: '/entrepreneur/requests' },
    { name: 'Inversionistas', icon: '', href: '/entrepreneur/investors' },
    { name: 'Chats', icon: '', href: '/entrepreneur/chats' },
    { name: 'Educación Financiera', icon: '', href: '/education' },
    
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

const confirmLogout = async () => {
  await logout();
};

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <Link href="/entrepreneur">
            <span className={styles.logoText}>Inver<span className={styles.logoHighlight}>Tech</span></span>
          </Link>
        </div>
        <p className={styles.userType}>Panel de Emprendedor</p>
      </div>

      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navText}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button onClick={handleLogoutClick} className={styles.logoutBtn}>
        <span className={styles.navText}>Cerrar Sesión</span>
      </button>

      {/* Modal de confirmación */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.modalHeader}>
              <h3>Confirmar Cierre de Sesión</h3>
            </div>
            <div className={styles.modalContent}>
              <p>¿Estás seguro de que deseas cerrar sesión?</p>
              <p className={styles.modalSubtext}>Serás redirigido a la página principal.</p>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={cancelLogout} 
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmLogout} 
                className={styles.confirmBtn}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}