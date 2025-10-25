'use client';
import { useEffect } from 'react';
import styles from './NotificationModal.module.css';

export default function NotificationModal({ 
  isOpen, 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = true 
}) {
  useEffect(() => {
    if (isOpen && autoClose && type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, type, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8h.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles[type]}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            {getIcon()}
          </div>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>

        {!autoClose && (
          <div className={styles.footer}>
            <button className={styles.okButton} onClick={onClose}>
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}