'use client';
import { useState } from 'react';
import styles from './DeleteRequestModal.module.css';

export default function DeleteRequestModal({ isOpen, solicitud, onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!solicitud) return;
    
    setIsDeleting(true);
    try {
      await onConfirm(solicitud.id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getAsuntoLabel = (asunto) => {
    const asuntoMap = {
      'investment': 'Propuesta de Inversión',
      'partnership': 'Propuesta de Sociedad',
      'collaboration': 'Colaboración',
      'mentoring': 'Mentoría',
      'other': 'Otro'
    };
    return asuntoMap[asunto] || asunto;
  };

  if (!isOpen || !solicitud) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Confirmar Eliminación</h3>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h4>¿Estás seguro de eliminar esta solicitud?</h4>
          
          <div className={styles.solicitudInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Emprendimiento:</span>
              <span className={styles.value}>{solicitud.emprendimiento.nombre}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Asunto:</span>
              <span className={styles.value}>{getAsuntoLabel(solicitud.asunto)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Emprendedor:</span>
              <span className={styles.value}>{solicitud.emprendedor.nombre}</span>
            </div>
          </div>

          <p className={styles.warningText}>
            Esta acción no se puede deshacer. La solicitud será eliminada permanentemente.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button 
            className={styles.deleteBtn}
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Solicitud'}
          </button>
        </div>
      </div>
    </div>
  );
}