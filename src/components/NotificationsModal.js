'use client';
import { useEffect } from 'react';
import { useNotificaciones } from '../hooks/useNotificaciones';
import styles from './NotificationsModal.module.css';

export default function NotificationsModal({ isOpen, onClose }) {
  const { notificaciones, isLoading, error, fetchNotificaciones } = useNotificaciones();

  useEffect(() => {
    if (isOpen) {
      fetchNotificaciones();
    }
  }, [isOpen]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Solicitudes de Financiamiento</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando solicitudes...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay solicitudes disponibles</p>
            </div>
          ) : (
            <div className={styles.solicitudesList}>
              {notificaciones.map((solicitud) => (
                <div key={solicitud.id} className={styles.solicitudCard}>
                  <div className={styles.cardHeader}>
                    <h3>{solicitud.emprendimiento}</h3>
                    <span className={`${styles.badge} ${styles[solicitud.riesgoColor]}`}>
                      {solicitud.riesgo} Riesgo
                    </span>
                  </div>
                  
                  <p className={styles.descripcion}>
                    {solicitud.descripcion?.substring(0, 100)}
                    {solicitud.descripcion?.length > 100 && '...'}
                  </p>
                  
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span>Emprendedor:</span>
                      <span>{solicitud.emprendedor}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>Monto:</span>
                      <span>{formatCurrency(solicitud.monto)}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>ROI:</span>
                      <span>{solicitud.roi}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>Categoría:</span>
                      <span>{solicitud.categoria}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>Riesgo:</span>
                      <span className={`${styles.riskBadge} ${styles[solicitud.riesgoColor]}`}>
                        {solicitud.riesgo}
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span>Fecha:</span>
                      <span>{formatDate(solicitud.fecha)}</span>
                    </div>
                  </div>

                  {solicitud.proposito && (
                    <div className={styles.proposito}>
                      <strong>Propósito:</strong>
                      <p>{solicitud.proposito.substring(0, 150)}{solicitud.proposito.length > 150 && '...'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <p>Total: {notificaciones.length} solicitudes</p>
          <button onClick={onClose} className={styles.closeBtn}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}