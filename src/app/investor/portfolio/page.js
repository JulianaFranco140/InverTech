'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useMyContactRequests } from '../../../hooks/useMyContactRequests';
import InvestorSidebar from '../../../components/InvestorSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import styles from './page.module.css';

function PortfolioPageContent() {
  const { user } = useAuth();
  const { solicitudes, estadisticas, isLoading, error, fetchSolicitudes } = useMyContactRequests();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  useEffect(() => {
    fetchSolicitudes();
  }, []);

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
      day: 'numeric'
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

  const getStatusColor = (estado) => {
    const statusColors = {
      'pendiente': 'warning',
      'revision': 'info',
      'proceso': 'primary',
      'aceptada': 'success',
      'rechazada': 'danger'
    };
    return statusColors[estado] || 'secondary';
  };

  const getStatusLabel = (estado) => {
    const statusLabels = {
      'pendiente': 'Pendiente',
      'revision': 'En Revisión',
      'proceso': 'En Proceso',
      'aceptada': 'Aceptada',
      'rechazada': 'Rechazada'
    };
    return statusLabels[estado] || estado;
  };

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const passFilter = selectedFilter === 'todos' || solicitud.estado === selectedFilter;
    const passCategory = selectedCategory === 'todas' || 
                        solicitud.emprendimiento.categoria.toLowerCase().includes(selectedCategory.toLowerCase());
    return passFilter && passCategory;
  });

  const totalInvestmentCommitted = solicitudes
    .filter(sol => ['proceso', 'aceptada'].includes(sol.estado))
    .reduce((sum, sol) => sum + sol.montoInversion, 0);

  const activeInvestments = solicitudes.filter(sol => 
    ['proceso', 'aceptada'].includes(sol.estado)
  ).length;

  const portfolioStats = {
    totalSolicitudes: solicitudes.length,
    totalInversion: solicitudes.reduce((sum, sol) => sum + sol.montoInversion, 0),
    totalCommitted: totalInvestmentCommitted,
    activeInvestments: activeInvestments,
    pendingReviews: estadisticas.pendientes + estadisticas.enRevision
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <InvestorSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando portafolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader 
          title="Mi Portafolio de Inversiones"
          subtitle="Gestiona y monitorea tus inversiones y proyectos de interés"
          userType="investor"
        />

        {/* Estadísticas del Portfolio */}
        <div className={styles.portfolioStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.4 15.6 4 15 4H9C8.4 4 8 4.4 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{portfolioStats.totalSolicitudes}</span>
              <span className={styles.statLabel}>Proyectos Contactados</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22M17 5H9.5C8.57 5 7.68 5.37 7.02 6.02C6.37 6.68 6 7.57 6 8.5S6.37 10.32 7.02 10.98C7.68 11.63 8.57 12 9.5 12H14.5C15.43 12 16.32 12.37 16.98 13.02C17.63 13.68 18 14.57 18 15.5S17.63 17.32 16.98 17.98C16.32 18.63 15.43 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{formatCurrency(portfolioStats.totalInversion)}</span>
              <span className={styles.statLabel}>Interés Total Expresado</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 16.5C4.5 17.88 5.62 19 7 19S9.5 17.88 9.5 16.5 8.38 14 7 14 4.5 15.12 4.5 16.5Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M14.5 6.5C14.5 7.88 15.62 9 17 9S19.5 7.88 19.5 6.5 18.38 4 17 4 14.5 5.12 14.5 6.5Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M17 9V12L14 15H10L7 12V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 14L4 17M17 4L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{portfolioStats.activeInvestments}</span>
              <span className={styles.statLabel}>Inversiones Activas</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <h3>Filtrar por Estado</h3>
            <div className={styles.filterButtons}>
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'pendiente', label: 'Pendientes' },
                { key: 'revision', label: 'En Revisión' },
                { key: 'proceso', label: 'En Proceso' },
                { key: 'aceptada', label: 'Aceptadas' },
                { key: 'rechazada', label: 'Rechazadas' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`${styles.filterBtn} ${
                    selectedFilter === filter.key ? styles.filterBtnActive : ''
                  }`}
                >
                  {filter.label}
                  {filter.key !== 'todos' && (
                    <span className={styles.filterCount}>
                      {filter.key === 'pendiente' ? estadisticas.pendientes :
                       filter.key === 'revision' ? estadisticas.enRevision :
                       filter.key === 'proceso' ? estadisticas.enProceso :
                       filter.key === 'aceptada' ? estadisticas.aceptadas :
                       filter.key === 'rechazada' ? estadisticas.rechazadas : 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.projectsSection}>
          <div className={styles.sectionHeader}>
            <h2>Proyectos en tu Portafolio</h2>
            <span className={styles.resultCount}>
              {filteredSolicitudes.length} de {solicitudes.length} proyectos
            </span>
          </div>

          {filteredSolicitudes.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H15M9 15H12M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No hay proyectos en esta categoría</h3>
              <p>No se encontraron proyectos que coincidan con los filtros seleccionados.</p>
              <a href="/projects" className={styles.exploreBtn}>
                Explorar Nuevos Proyectos
              </a>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {filteredSolicitudes.map((solicitud) => (
                <div key={solicitud.id} className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.projectInfo}>
                      <div className={styles.projectAvatar}>
                        {solicitud.emprendimiento.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.projectDetails}>
                        <h3 className={styles.projectName}>
                          {solicitud.emprendimiento.nombre}
                        </h3>
                        <p className={styles.entrepreneurName}>
                          {solicitud.emprendedor.nombre}
                        </p>
                        <span className={styles.categoryBadge}>
                          {solicitud.emprendimiento.categoria}
                        </span>
                      </div>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[getStatusColor(solicitud.estado)]}`}>
                      {getStatusLabel(solicitud.estado)}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.projectDescription}>
                      {solicitud.emprendimiento.descripcion}
                    </p>

                    <div className={styles.investmentDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tipo de Contacto:</span>
                        <span className={styles.detailValue}>
                          {getAsuntoLabel(solicitud.asunto)}
                        </span>
                      </div>
                      
                      {solicitud.montoInversion > 0 && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Monto de Interés:</span>
                          <span className={styles.detailValue}>
                            {formatCurrency(solicitud.montoInversion)}
                          </span>
                        </div>
                      )}

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Ingresos Mensuales:</span>
                        <span className={styles.detailValue}>
                          {formatCurrency(solicitud.emprendimiento.ingresosMensuales)}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Fecha de Contacto:</span>
                        <span className={styles.detailValue}>
                          {formatDate(solicitud.fechaSolicitud)}
                        </span>
                      </div>
                    </div>

                    {solicitud.especializaciones && solicitud.especializaciones.length > 0 && (
                      <div className={styles.specializations}>
                        <span className={styles.specializationsLabel}>Especializaciones:</span>
                        <div className={styles.specializationTags}>
                          {solicitud.especializaciones.map((spec, index) => (
                            <span key={index} className={styles.specializationTag}>
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.viewDetailsBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Ver Detalles
                    </button>
                    
                    {solicitud.estado === 'aceptada' && (
                      <button className={styles.chatBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Ir al Chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <PortfolioPageContent />
    </ProtectedRoute>
  );
}