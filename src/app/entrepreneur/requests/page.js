'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import EntrepreneurSidebar from '../../../components/EntrepreneurSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import NotificacionModal from '../../../components/NotificacionModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useAuth } from '../../../hooks/useAuth';
import styles from './page.module.css';

function MyRequestsPageContent() {
  const { user, isLoading: userLoading } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    solicitudId: null,
    solicitudName: '',
    isLoading: false
  });

  const showNotification = (type, title, message, autoClose = true) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
    
    if (autoClose) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
      }, 5000);
    }
  };

  // SVG Icons Components
  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6"/>
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );

  const ClipboardIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="m16,4h2a2,2 0 0,1 2,2v14a2,2 0 0,1 -2,2H6a2,2 0 0,1 -2,-2V6A2,2 0 0,1 6,4h2"/>
    </svg>
  );

  const DocumentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        console.log('❌ No token found for solicitudes');
        setSolicitudes([]);
        return;
      }

      console.log('📡 Fetching solicitudes...');

      const response = await fetch('/api/solicitudes-financiamiento', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Solicitudes loaded:', data.solicitudes?.length || 0);
        setSolicitudes(data.solicitudes || []);
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setSolicitudes([]);
        showNotification('error', 'Error', 'No se pudieron cargar las solicitudes');
      }
    } catch (error) {
      console.error('❌ Error fetching solicitudes:', error);
      setSolicitudes([]);
      showNotification('error', 'Error', 'Error de conexión al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (solicitudId) => {
    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(`/api/solicitudes-financiamiento/${solicitudId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedSolicitud(data.solicitud);
        setShowDetails(true);
      } else {
        showNotification('error', 'Error', 'No se pudieron cargar los detalles de la solicitud');
      }
    } catch (error) {
      console.error('Error loading solicitud details:', error);
      showNotification('error', 'Error', 'Error al cargar los detalles');
    }
  };

  const handleDeleteSolicitud = (solicitud) => {
    setConfirmModal({
      isOpen: true,
      solicitudId: solicitud.id_solicitud,
      solicitudName: `${solicitud.tipo_financiamiento} - ${solicitud.emprendimiento_nombre}`,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!confirmModal.solicitudId) return;
    
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(`/api/solicitudes-financiamiento/${confirmModal.solicitudId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConfirmModal({
          isOpen: false,
          solicitudId: null,
          solicitudName: '',
          isLoading: false
        });
        
        showNotification(
          'success',
          '¡Solicitud eliminada!',
          'La solicitud ha sido eliminada exitosamente.'
        );
        
        fetchSolicitudes();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la solicitud');
      }
    } catch (error) {
      console.error('Error deleting solicitud:', error);
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
      showNotification('error', 'Error', error.message);
    }
  };

  const handleDownloadFile = async (documento) => {
    try {
      const link = document.createElement('a');
      link.href = documento.url_supabase;
      link.download = documento.nombre_archivo;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', 'Descarga iniciada', `Descargando ${documento.nombre_archivo}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      showNotification('error', 'Error', 'No se pudo descargar el archivo');
    }
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_revision': return 'info';
      case 'aprobada': return 'success';
      case 'rechazada': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_revision': return 'En Revisión';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return estado;
    }
  };

  const canDelete = (estado) => {
    return ['pendiente', 'rechazada', 'aprobada'].includes(estado);
  };

  useEffect(() => {
    if (user && !userLoading) {
      fetchSolicitudes();
    }
  }, [user, userLoading]);

  if (userLoading) {
    return (
      <div className={styles.pageContainer}>
        <EntrepreneurSidebar />
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
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader
          title="Mis Solicitudes de Financiamiento"
          subtitle="Gestiona y revisa todas tus solicitudes de inversión"
          userType="entrepreneur"
          primaryButtonText="Nueva Solicitud"
          primaryButtonAction={() => window.location.href = '/entrepreneur'}
        />

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando solicitudes...</p>
            </div>
          ) : solicitudes.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ClipboardIcon />
              </div>
              <h3>No tienes solicitudes de financiamiento</h3>
              <p>Crea tu primera solicitud para comenzar a buscar inversionistas.</p>
              <a href="/entrepreneur" className={styles.createButton}>
                Crear Primera Solicitud
              </a>
            </div>
          ) : (
            <div className={styles.solicitudesGrid}>
              {solicitudes.map((solicitud) => (
                <div key={solicitud.id_solicitud} className={styles.solicitudCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      <h3>{solicitud.emprendimiento_nombre}</h3>
                      <span className={`${styles.statusBadge} ${styles[getStatusColor(solicitud.estado)]}`}>
                        {getStatusText(solicitud.estado)}
                      </span>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        onClick={() => handleViewDetails(solicitud.id_solicitud)}
                        className={styles.viewButton}
                        title="Ver detalles"
                      >
                        <EyeIcon />
                      </button>
                      {canDelete(solicitud.estado) && (
                        <button 
                          onClick={() => handleDeleteSolicitud(solicitud)}
                          className={styles.deleteButton}
                          title="Eliminar solicitud"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Monto:</span>
                      <span className={styles.value}>{formatCurrency(solicitud.monto_solicitado)}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Tipo:</span>
                      <span className={styles.value}>{solicitud.tipo_financiamiento}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Fecha:</span>
                      <span className={styles.value}>{formatDate(solicitud.fecha_solicitud)}</span>
                    </div>
                    {solicitud.ganancia_anual && (
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Ganancia Anual:</span>
                        <span className={styles.value}>{formatCurrency(solicitud.ganancia_anual)}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <p className={styles.purpose}>
                      <strong>Propósito:</strong> {solicitud.proposito?.substring(0, 100)}
                      {solicitud.proposito?.length > 100 && '...'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedSolicitud && (
        <div className={styles.modalOverlay} onClick={() => setShowDetails(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalles de la Solicitud</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowDetails(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>Información General</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Proyecto:</label>
                    <span>{selectedSolicitud.emprendimiento_nombre}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Estado:</label>
                    <span className={`${styles.statusBadge} ${styles[getStatusColor(selectedSolicitud.estado)]}`}>
                      {getStatusText(selectedSolicitud.estado)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Monto Solicitado:</label>
                    <span>{formatCurrency(selectedSolicitud.monto_solicitado)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Tipo de Financiamiento:</label>
                    <span>{selectedSolicitud.tipo_financiamiento}</span>
                  </div>
                  {selectedSolicitud.ganancia_anual && (
                    <div className={styles.detailItem}>
                      <label>Ganancia Anual:</label>
                      <span>{formatCurrency(selectedSolicitud.ganancia_anual)}</span>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <label>Fecha de Solicitud:</label>
                    <span>{formatDate(selectedSolicitud.fecha_solicitud)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>Propósito del Financiamiento</h3>
                <div className={styles.textContent}>
                  <p>{selectedSolicitud.proposito}</p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>Cronograma de Uso de Fondos</h3>
                <div className={styles.textContent}>
                  <p>{selectedSolicitud.cronograma}</p>
                </div>
              </div>

              {selectedSolicitud.documentos && selectedSolicitud.documentos.length > 0 && (
                <div className={styles.detailSection}>
                  <h3>Documentos Adjuntos</h3>
                  <div className={styles.documentsGrid}>
                    {selectedSolicitud.documentos.map((documento, index) => (
                      <div key={index} className={styles.documentCard}>
                        <div className={styles.documentInfo}>
                          <div className={styles.documentIcon}>
                            <DocumentIcon />
                          </div>
                          <div className={styles.documentDetails}>
                            <span className={styles.documentName}>{documento.nombre_archivo}</span>
                            <span className={styles.documentSize}>
                              {(documento.tamano_archivo / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span className={styles.documentDate}>
                              {formatDate(documento.fecha_subida)}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownloadFile(documento)}
                          className={styles.downloadButton}
                        >
                          <DownloadIcon />
                          <span>Descargar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {canDelete(selectedSolicitud.estado) && (
                <button 
                  onClick={() => {
                    setShowDetails(false);
                    handleDeleteSolicitud(selectedSolicitud);
                  }}
                  className={styles.deleteModalButton}
                >
                  <TrashIcon />
                  <span>Eliminar Solicitud</span>
                </button>
              )}
              <button 
                onClick={() => setShowDetails(false)}
                className={styles.closeModalButton}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type="danger"
        title="Eliminar Solicitud"
        message={`¿Estás seguro de que quieres eliminar la solicitud "${confirmModal.solicitudName}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, solicitudId: null, solicitudName: '', isLoading: false })}
        isLoading={confirmModal.isLoading}
      />

      <NotificacionModal
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
    <ProtectedRoute requiredRole={1}>
      <MyRequestsPageContent />
    </ProtectedRoute>
  );
}