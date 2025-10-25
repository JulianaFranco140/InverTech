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
    } else if (diffInMinutes < 1440) { // 24 horas
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days !== 1 ? 's' : ''}`;
    }
  };

  // ✅ Separar notificaciones por tipo para debugging
  const solicitudes = notificaciones.filter(n => n.tipo === 'solicitud_financiamiento');
  const emprendimientos = notificaciones.filter(n => n.tipo === 'nuevo_emprendimiento');

  console.log('🔍 Debug Modal - Notificaciones:', {
    total: notificaciones.length,
    solicitudes: solicitudes.length,
    emprendimientos: emprendimientos.length,
    tipos: notificaciones.map(n => n.tipo)
  });

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
              {/* ✅ Mostrar breakdown para debugging */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ 
                  background: '#f0f0f0', 
                  padding: '8px', 
                  margin: '8px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  DEBUG: {solicitudes.length} solicitudes, {emprendimientos.length} emprendimientos
                </div>
              )}
              
              {notificaciones.map((notificacion) => (
                <div key={notificacion.id} className={styles.notificacionCard}>
                  {/* ✅ Header con tipo de notificación */}
                  <div className={styles.notificationHeader}>
                    <div className={styles.notificationIcon}>
                      {notificacion.tipo === 'solicitud_financiamiento' ? '💰' : '🚀'}
                    </div>
                    <div className={styles.notificationTitle}>
                      <h4>{notificacion.titulo}</h4>
                      <span className={styles.timeAgo}>{getTimeAgo(notificacion.fecha)}</span>
                    </div>
                  </div>

                  {/* ✅ Contenido principal */}
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
                      <span>Emprendedor:</span>
                      <span>{notificacion.emprendedor}</span>
                    </div>
                    <div className={styles.detail}>
                      <span>Categoría:</span>
                      <span>{notificacion.categoria}</span>
                    </div>
                    
                    {/* ✅ Detalles específicos por tipo */}
                    {notificacion.tipo === 'solicitud_financiamiento' ? (
                      <>
                        <div className={styles.detail}>
                          <span>Monto:</span>
                          <span>{formatCurrency(notificacion.monto)}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>ROI:</span>
                          <span>{notificacion.roi}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Tipo:</span>
                          <span>{notificacion.tipoFinanciamiento}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.detail}>
                          <span>Empleados:</span>
                          <span>{notificacion.cantidadEmpleados || 0}</span>
                        </div>
                        <div className={styles.detail}>
                          <span>Clientes:</span>
                          <span>{notificacion.cantidadClientes || 0}</span>
                        </div>
                      </>
                    )}
                    
                    <div className={styles.detail}>
                      <span>Fecha:</span>
                      <span>{formatDate(notificacion.fecha)}</span>
                    </div>
                  </div>

                  {/* ✅ Propósito solo para solicitudes */}
                  {notificacion.tipo === 'solicitud_financiamiento' && notificacion.proposito && (
                    <div className={styles.proposito}>
                      <strong>Propósito:</strong>
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