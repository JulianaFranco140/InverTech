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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const fecha = new Date(dateString);
    const diffInMinutes = Math.floor((now - fecha) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days !== 1 ? 's' : ''}`;
    }
  };

  const MoneyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9C3 10.1 3.9 11 5 11V17C5 18.1 5.9 19 7 19V21C7 21.6 7.4 22 8 22H16C16.6 22 17 21.6 17 21V19C18.1 19 19 18.1 19 17V11C20.1 11 21 10.1 21 9ZM11 19V16H13V19H11ZM7 17V11H17V17H7Z"/>
    </svg>
  );

  const RocketIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.81 14.12L5.64 11.29L8.17 10.79C11.39 6.41 16.8 4.16 22 4.95C22.79 10.15 20.54 15.56 16.16 18.78L15.66 21.31L12.83 18.48L10.54 16.19L2.81 14.12ZM15.66 7.26C16.84 6.08 18.69 6.08 19.87 7.26C21.05 8.44 21.05 10.29 19.87 11.47C18.69 12.65 16.84 12.65 15.66 11.47C14.5 10.29 14.5 8.44 15.66 7.26ZM5.64 16.64L7.05 18.05C7.84 18.84 7.84 20.16 7.05 20.95C6.26 21.74 4.94 21.74 4.15 20.95L2.74 19.54C1.95 18.75 1.95 17.43 2.74 16.64C3.53 15.85 4.85 15.85 5.64 16.64Z"/>
    </svg>
  );

  const solicitudes = notificaciones.filter(n => n.tipo === 'solicitud_financiamiento');
  const emprendimientos = notificaciones.filter(n => n.tipo === 'nuevo_emprendimiento');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Notificaciones</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando notificaciones...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay notificaciones recientes</p>
              <small>Las notificaciones de los últimos 30 días aparecerán aquí</small>
            </div>
          ) : (
            <div className={styles.notificacionesList}>
              {notificaciones.map((notificacion) => (
                <div 
                  key={notificacion.id} 
                  className={styles.notificacionCard}
                  data-tipo={notificacion.tipo}
                >
                  <div className={styles.notificationHeader}>
                    <div 
                      className={styles.notificationIcon}
                      data-tipo={notificacion.tipo}
                    >
                      {notificacion.tipo === 'solicitud_financiamiento' ? <MoneyIcon /> : <RocketIcon />}
                    </div>
                    <div className={styles.notificationTitle}>
                      <h4>{notificacion.titulo}</h4>
                      <span className={styles.timeAgo}>{getTimeAgo(notificacion.fecha)}</span>
                    </div>
                  </div>

                  <div className={styles.cardHeader}>
                    <h3>{notificacion.emprendimiento}</h3>
                    {notificacion.tipo === 'solicitud_financiamiento' && (
                      <span className={`${styles.badge} ${styles[notificacion.riesgoColor]}`}>
                        {notificacion.riesgo} Riesgo
                      </span>
                    )}
                    {notificacion.tipo === 'nuevo_emprendimiento' && (
                      <span className={`${styles.badge} ${styles.new}`}>
                        Nuevo
                      </span>
                    )}
                  </div>
                  
                  <p className={styles.descripcion}>
                    {notificacion.descripcion?.substring(0, 100)}
                    {notificacion.descripcion?.length > 100 && '...'}
                  </p>
                  
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span>Emprendedor</span>
                      <span>{notificacion.emprendedor}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>Categoría</span>
                      <span>{notificacion.categoria}</span>
                    </div>
                    
                    {notificacion.tipo === 'solicitud_financiamiento' ? (
                      <>
                        <div className={styles.detail}>
                          <span>Monto</span>
                          <span>{formatCurrency(notificacion.monto)}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>ROI</span>
                          <span>{notificacion.roi}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Tipo</span>
                          <span>{notificacion.tipoFinanciamiento}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Fecha</span>
                          <span>{formatDate(notificacion.fecha)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.detail}>
                          <span>Empleados</span>
                          <span>{notificacion.cantidadEmpleados || 0}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Clientes</span>
                          <span>{notificacion.cantidadClientes || 0}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Fecha</span>
                          <span>{formatDate(notificacion.fecha)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {notificacion.tipo === 'solicitud_financiamiento' && notificacion.proposito && (
                    <div className={styles.proposito}>
                      <strong>Propósito</strong>
                      <p>{notificacion.proposito.substring(0, 150)}{notificacion.proposito.length > 150 && '...'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <p>
            Total: {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''} 
            {notificaciones.length > 0 && (
              <small style={{ color: '#6c757d', marginLeft: '8px' }}>
                ({solicitudes.length} solicitudes, {emprendimientos.length} emprendimientos)
              </small>
            )}
          </p>
          <button onClick={onClose} className={styles.closeBtn}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}