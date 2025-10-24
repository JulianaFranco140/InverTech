'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import EntrepreneurSidebar from '../../components/EntrepreneurSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import FundingModal from '../../components/FundingModal';
import { useEmprendimientos } from '../../hooks/useEmprendimientos';
import { useAuth } from '../../hooks/useAuth';
import { getToken, createAuthHeaders, handleTokenError } from '../../lib/tokenUtils';
import styles from './page.module.css';

function EntrepreneurDashboardContent() {
  const { user, isLoading: userLoading } = useAuth();
  const { emprendimientos, isLoading: emprendimientosLoading } = useEmprendimientos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(true);

useEffect(() => {
  
  if (user && !userLoading) {
    fetchSolicitudes();
  } else {
  }
}, [user, userLoading]);
  const fetchSolicitudes = async () => {
    try {
      setIsLoadingSolicitudes(true);
      
      const token = getToken();
      
      if (!token) {
        setSolicitudes([]);
        return;
      }

      const response = await fetch('/api/solicitudes-financiamiento', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data.solicitudes || []);
      } else {
        if (response.status === 401) {
          return handleTokenError();
        }
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setSolicitudes([]);
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      setSolicitudes([]);
    } finally {
      setIsLoadingSolicitudes(false);
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

  const formatCurrencyShort = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const calculateTimeInMarket = (fechaCreacion) => {
    const startDate = new Date(fechaCreacion);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
    } else {
      return `${months} mes${months !== 1 ? 'es' : ''}`;
    }
  };

  const calcularEstadisticas = () => {
    if (!emprendimientos || emprendimientos.length === 0) {
      return {
        totalProyectos: 0,
        totalEmpleados: 0,
        totalClientes: 0,
        totalIngresosMensuales: 0,
        totalFinanciamiento: 0,
        totalFinanciamientoAprobado: 0,
        solicitudesPendientes: 0,
        solicitudesAprobadas: 0,
        valoracionEstimada: 0
      };
    }

    const totalProyectos = emprendimientos.length;

    const totalEmpleados = emprendimientos.reduce((sum, emp) => sum + (emp.cantidad_empleados || 0), 0);

    const totalClientes = emprendimientos.reduce((sum, emp) => sum + (emp.cantidad_clientes || 0), 0);





    const totalIngresosMensuales = emprendimientos.reduce((sum, emp) => {
      const ingresos = parseFloat(emp.ingresos_mensuales);
      return sum + (isNaN(ingresos) ? 0 : ingresos);
    }, 0);

  const totalFinanciamiento = solicitudes.reduce((sum, sol) => {
    const monto = parseFloat(sol.monto_solicitado);
    return sum + (isNaN(monto) ? 0 : monto);
  }, 0);
  
  const totalFinanciamientoAprobado = solicitudes
    .filter(sol => sol.estado === 'aprobada')
    .reduce((sum, sol) => {
      const monto = parseFloat(sol.monto_solicitado);
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);
  
  const solicitudesPendientes = solicitudes.filter(sol => sol.estado === 'pendiente').length;
  const solicitudesAprobadas = solicitudes.filter(sol => sol.estado === 'aprobada').length;

    const ingresosAnuales = totalIngresosMensuales * 12;
    const valoracionEstimada = (ingresosAnuales * 4) + totalFinanciamientoAprobado;

    return {
      totalProyectos,
      totalEmpleados,
      totalClientes,
      totalIngresosMensuales,
      totalFinanciamiento,
      totalFinanciamientoAprobado,
      solicitudesPendientes,
      solicitudesAprobadas,
      valoracionEstimada,
      ingresosAnuales
    };
  };

  const stats = calcularEstadisticas();

  const metricsData = [
    {
      label: 'Financiamiento Total',
      value: formatCurrencyShort(stats.totalFinanciamiento),
      subtext: stats.totalFinanciamientoAprobado > 0 
        ? `${formatCurrencyShort(stats.totalFinanciamientoAprobado)} aprobado`
        : 'Solicita tu primer financiamiento'
    },
    {
      label: 'Proyectos Activos',
      value: stats.totalProyectos.toString(),
      change: stats.totalProyectos > 0 ? `${stats.totalProyectos} proyectos registrados` : 'Crea tu primer proyecto',
      isPositive: stats.totalProyectos > 0
    }
  ];

  const handleRequestFunding = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchSolicitudes();
  };

  if (userLoading || emprendimientosLoading || isLoadingSolicitudes) {
    return (
      <div className={styles.pageContainer}>
        <EntrepreneurSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando tu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      <div className={styles.mainContent}>
        <DashboardHeader
          title={`¡Hola, ${user?.name || 'Emprendedor'}!`}
          subtitle={`Gestiona tus ${stats.totalProyectos} emprendimientos y haz crecer tu portafolio`}
          userType="entrepreneur"
          primaryButtonText="+ Solicitar Financiamiento"
          primaryButtonAction={handleRequestFunding}
          secondaryButtonText="Actualizar"
          secondaryButtonAction={() => window.location.reload()} 
          notificationCount={stats.solicitudesPendientes}
        />

        <div className={styles.dashboardContent}>
          <div className={styles.summarySection}>
            <h2>Resumen de Portafolio</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Proyectos Activos</span>
                <span className={styles.summaryValue}>{stats.totalProyectos}</span>
                <span className={styles.summarySubtext}>
                  {stats.totalProyectos === 0 ? 'Crea tu primer proyecto' : 'emprendimientos'}
                </span>
              </div>
              
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Empleados Total</span>
                <span className={styles.summaryValue}>{stats.totalEmpleados}</span>
                <span className={styles.summarySubtext}>
                  {stats.totalEmpleados === 0 ? 'Registra empleados' : 'colaboradores'}
                </span>
              </div>
              
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Clientes Total</span>
                <span className={styles.summaryValue}>{stats.totalClientes}</span>
                <span className={styles.summarySubtext}>
                  {stats.totalClientes === 0 ? 'Registra clientes' : 'clientes activos'}
                </span>
              </div>
              
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Ingresos Mensuales</span>
                <span className={styles.summaryValue}>{formatCurrencyShort(stats.totalIngresosMensuales)}</span>
                <span className={styles.summarySubtext}>
                  {stats.totalIngresosMensuales === 0 ? 'Actualiza ingresos' : 'ingresos totales'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.metricsSection}>
            <h2>Métricas Clave</h2>
            <div className={styles.metricsGrid}>
              {metricsData.map((metric, index) => (
                <div key={index} className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>{metric.label}</span>
                  </div>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>{metric.value}</span>
                    {metric.change && (
                      <span className={`${styles.metricChange} ${metric.isPositive ? styles.positive : styles.neutral}`}>
                        {metric.change}
                      </span>
                    )}
                    {metric.subtext && (
                      <span className={styles.metricSubtext}>{metric.subtext}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.projectsSection}>
            <h2>Mis Emprendimientos</h2>
            
            {emprendimientos.length === 0 ? (
              <div className={styles.emptyProjects}>
                <h3>¡Comienza tu viaje emprendedor!</h3>
                <p>No tienes proyectos registrados aún. Crea tu primer emprendimiento para comenzar.</p>
                <a href="/entrepreneur/project" className={styles.createProjectBtn}>
                  Crear Mi Primer Proyecto
                </a>
              </div>
            ) : (
              <div className={styles.projectsGrid}>
                {emprendimientos.slice(0, 6).map((project) => (
                  <div key={project.id_emprendimiento} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <div className={styles.projectInfo}>
                        <h3>{project.nombre}</h3>
                        <p>{project.descripcion}</p>
                        <div className={styles.projectTags}>
                          <span className={`${styles.statusTag} ${styles.active}`}>Activo</span>
                          <span className={styles.categoryTag}>
                            {project.categoria === 1 ? 'Tecnología' :
                             project.categoria === 2 ? 'Fintech' :
                             project.categoria === 3 ? 'E-commerce' :
                             project.categoria === 4 ? 'Sostenibilidad' :
                             project.categoria === 5 ? 'Salud' :
                             'Otro'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.projectMetrics}>
                      <div className={styles.projectMetric}>
                        <span className={styles.metricValue}>{formatCurrencyShort(project.ingresos_mensuales)}</span>
                        <span className={styles.metricLabel}>Ingresos/mes</span>
                      </div>
                      <div className={styles.projectMetric}>
                        <span className={styles.metricValue}>{project.cantidad_empleados}</span>
                        <span className={styles.metricLabel}>Empleados</span>
                      </div>
                      <div className={styles.projectMetric}>
                        <span className={styles.metricValue}>{project.cantidad_clientes}</span>
                        <span className={styles.metricLabel}>Clientes</span>
                      </div>
                    </div>
                    
                    <div className={styles.projectFooter}>
                      <span className={styles.projectAge}>
                        {calculateTimeInMarket(project.fecha_creacion)} en el mercado
                      </span>
                      <a href={`/entrepreneur/project`} className={styles.projectLink}>
                        Ver detalles →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {emprendimientos.length > 6 && (
              <div className={styles.viewMoreProjects}>
                <a href="/entrepreneur/project" className={styles.viewMoreBtn}>
                  Ver todos los proyectos ({emprendimientos.length})
                </a>
              </div>
            )}
          </div>

          {solicitudes.length > 0 && (
            <div className={styles.requestsSection}>
              <h2 className={styles.requestsTitle}>Solicitudes de Financiamiento Recientes</h2>
              <div className={styles.requestsGrid}>
                {solicitudes.slice(0, 3).map((solicitud) => (
                  <div key={solicitud.id_solicitud} className={styles.requestCard}>
                    <div className={styles.requestHeader}>
                      <h4>{solicitud.emprendimiento_nombre}</h4>
                      <span className={`${styles.requestStatus} ${styles[solicitud.estado]}`}>
                        {solicitud.estado === 'pendiente' ? 'Pendiente' :
                         solicitud.estado === 'en_revision' ? 'En Revisión' :
                         solicitud.estado === 'aprobada' ? 'Aprobada' :
                         solicitud.estado === 'rechazada' ? 'Rechazada' :
                         solicitud.estado}
                      </span>
                    </div>
                    <div className={styles.requestContent}>
                      <p><strong>Monto:</strong> {formatCurrency(solicitud.monto_solicitado)}</p>
                      <p><strong>Tipo:</strong> {solicitud.tipo_financiamiento}</p>
                      <p><strong>Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {solicitudes.length > 3 && (
                <div className={styles.viewMoreRequests}>
                  <a href="/entrepreneur/requests" className={styles.viewMoreBtn}>
                    Ver todas las solicitudes ({solicitudes.length})
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FundingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default function EntrepreneurDashboard() {
  return (
    <ProtectedRoute requiredRole={1}>
      <EntrepreneurDashboardContent />
    </ProtectedRoute>
  );
}