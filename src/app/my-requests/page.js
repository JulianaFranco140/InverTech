'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useMyContactRequests } from '../../hooks/useMyContactRequests';
import InvestorSidebar from '../../components/InvestorSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import DeleteRequestModal from '../../components/DeleteRequestModal';
import NotificationModal from '../../components/NotificationModal'; 
import styles from './page.module.css';

function MyRequestsPageContent() {
  const { user, isLoading: userLoading } = useAuth();
  const { solicitudes, estadisticas, isLoading, error, fetchSolicitudes, eliminarSolicitud } = useMyContactRequests();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    solicitud: null
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const showNotification = (type, title, message, autoClose = true) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
    
    if (autoClose && type === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
      }, 3000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const canDelete = (estado) => {
    return estado === 'pendiente';
  };

  const solicitudesFiltradas = filtroEstado === 'todos' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtroEstado);

  const handleDeleteClick = (solicitud) => {
    if (!canDelete(solicitud.estado)) {
      const estadoTexto = {
        'revision': 'en revisión',
        'proceso': 'en proceso',
        'aceptada': 'aceptada',
        'rechazada': 'rechazada',
        'completada': 'completada'
      }[solicitud.estado] || solicitud.estado;

      showNotification(
        'warning',
        'No se puede eliminar',
        `No puedes eliminar una solicitud que está ${estadoTexto}. Solo se pueden eliminar solicitudes pendientes.`,
        false
      );
      return;
    }

    setDeleteModal({
      isOpen: true,
      solicitud: solicitud
    });
  };

  const handleDeleteConfirm = async (solicitudId) => {
    try {
      const result = await eliminarSolicitud(solicitudId);
      
      setDeleteModal({ isOpen: false, solicitud: null });
      
      showNotification(
        'success',
        '¡Solicitud eliminada!',
        result.message || 'La solicitud ha sido eliminada exitosamente.'
      );
      
    } catch (error) {
      showNotification(
        'error',
        'Error',
        error.message || 'Error al eliminar la solicitud'
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, solicitud: null });
  };

  if (userLoading) {
    return (
      <div className={styles.requestsContainer}>
        <InvestorSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.requestsContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleSection}>
              <Link href="/dashboard" className={styles.backLink}>
                ← Volver al Dashboard
              </Link>
              <h1 className={styles.pageTitle}>Mis Solicitudes de Contacto</h1>
              <p className={styles.pageSubtitle}>
                Gestiona las solicitudes que has enviado a emprendedores
              </p>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{solicitudes.length}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{estadisticas.pendientes}</span>
                <span className={styles.statLabel}>Pendientes</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{estadisticas.aceptadas}</span>
                <span className={styles.statLabel}>Aceptadas</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{estadisticas.rechazadas}</span>
                <span className={styles.statLabel}>Rechazadas</span>
              </div>
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.filters}>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="revision">En Revisión</option>
                <option value="proceso">En Proceso</option>
                <option value="aceptada">Aceptadas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {isLoading ? 'Cargando...' : 
                `${solicitudesFiltradas.length} solicitud${solicitudesFiltradas.length !== 1 ? 'es' : ''} encontrada${solicitudesFiltradas.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando solicitudes...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>Error: {error}</p>
              <button onClick={fetchSolicitudes} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No hay solicitudes</h3>
              <p>
                {filtroEstado === 'todos' 
                  ? 'Aún no has enviado solicitudes de contacto.'
                  : `No tienes solicitudes en estado "${filtroEstado}".`
                }
              </p>
              <Link href="/projects" className={styles.exploreBtn}>
                Explorar Proyectos
              </Link>
            </div>
          ) : (
            <div className={styles.requestsList}>
              {solicitudesFiltradas.map(solicitud => (
                <div key={solicitud.id} className={styles.requestCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitleRow}>
                        <h3 className={styles.emprendimientoTitle}>
                          {solicitud.emprendimiento.nombre}
                        </h3>
                        <span className={`${styles.estadoBadge} ${styles[solicitud.estadoInfo.color]}`}>
                          {solicitud.estadoInfo.label}
                        </span>
                      </div>
                      <p className={styles.asunto}>
                        {getAsuntoLabel(solicitud.asunto)}
                      </p>
                      <div className={styles.projectMeta}>
                        <span className={styles.category}>
                          {solicitud.emprendimiento.categoria}
                        </span>
                        <span className={styles.revenue}>
                          {formatCurrency(solicitud.emprendimiento.ingresosMensuales)}/mes
                        </span>
                        <span className={styles.entrepreneur}>
                          {solicitud.emprendedor.nombre}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className={styles.mensaje}>
                      <h4>Mensaje enviado:</h4>
                      <p>{solicitud.mensaje}</p>
                    </div>
                    
                    {solicitud.montoInversion > 0 && (
                      <div className={styles.montoInfo}>
                        <span className={styles.montoLabel}>Monto de interés:</span>
                        <span className={styles.montoValue}>
                          {formatCurrency(solicitud.montoInversion)}
                        </span>
                      </div>
                    )}

                    {solicitud.especializaciones.length > 0 && (
                      <div className={styles.especializaciones}>
                        <span className={styles.especializacionesLabel}>Especializaciones:</span>
                        <div className={styles.especializacionesList}>
                          {solicitud.especializaciones.map((esp, index) => (
                            <span key={index} className={styles.especializacionTag}>
                              {esp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.fechaInfo}>
                      <span className={styles.fechaLabel}>Enviada:</span>
                      <span className={styles.fechaValue}>
                        {formatDate(solicitud.fechaSolicitud)}
                      </span>
                    </div>
                    
                    <div className={styles.cardActions}>
                      {canDelete(solicitud.estado) ? (
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteClick(solicitud)}
                        >
                          Eliminar
                        </button>
                      ) : (
                        <span className={styles.noDeleteText}>
                          No se puede eliminar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteRequestModal
        isOpen={deleteModal.isOpen}
        solicitud={deleteModal.solicitud}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        autoClose={notification.type === 'success'}
      />
    </div>
  );
}

export default function MyRequestsPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <MyRequestsPageContent />
    </ProtectedRoute>
  );
}