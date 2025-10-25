'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import InvestorSidebar from '../../components/InvestorSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import ContactEntrepreneurModal from '../../components/ContactEntrepreneurModal';
import styles from './page.module.css';

function ProjectsPageContent() {
  const { user, isLoading: userLoading } = useAuth();
  const { projects, filteredProjects, isLoading, error, fetchProjects, filterProjects } = useProjects();
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minRevenue: '',
    minEmployees: ''
  });
  const [contactModal, setContactModal] = useState({
    isOpen: false,
    project: null
  });

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects(filters);
  }, [filters, projects]);

  const toggleDescription = (projectId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyShort = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleContactClick = (project) => {
    setContactModal({
      isOpen: true,
      project: project
    });
  };

  const handleContactClose = () => {
    setContactModal({
      isOpen: false,
      project: null
    });
  };

  const handleContactSuccess = () => {
    setContactModal({
      isOpen: false,
      project: null
    });
  };

  if (userLoading) {
    return (
      <div className={styles.projectsContainer}>
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
    <div className={styles.projectsContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleSection}>
              <Link href="/dashboard" className={styles.backLink}>
                ← Volver al Dashboard
              </Link>
              <h1 className={styles.pageTitle}>Explorador de Proyectos</h1>
              <p className={styles.pageSubtitle}>
                Descubre emprendimientos innovadores y conecta directamente con los emprendedores
              </p>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{filteredProjects.length}</span>
                <span className={styles.statLabel}>Proyectos</span>
              </div>
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Buscar proyectos por nombre, descripción o emprendedor..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filters}>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todas las categorías</option>
                <option value="tecnología">Tecnología</option>
                <option value="fintech">Fintech</option>
                <option value="e-commerce">E-commerce</option>
                <option value="sostenibilidad">Sostenibilidad</option>
                <option value="salud">Salud</option>
                <option value="educación">Educación</option>
                <option value="agricultura">Agricultura</option>
                <option value="alimentación">Alimentación</option>
                <option value="servicios">Servicios</option>
              </select>
              
              <input
                type="number"
                placeholder="Ingresos mín/mes"
                value={filters.minRevenue}
                onChange={(e) => handleFilterChange('minRevenue', e.target.value)}
                className={styles.filterInput}
              />
              
              <input
                type="number"
                placeholder="Empleados mínimos"
                value={filters.minEmployees}
                onChange={(e) => handleFilterChange('minEmployees', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {isLoading ? 'Cargando...' : 
                `${filteredProjects.length} proyecto${filteredProjects.length !== 1 ? 's' : ''} encontrado${filteredProjects.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando proyectos...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>Error: {error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No hay proyectos disponibles</h3>
              <p>No se encontraron emprendimientos que coincidan con tus filtros.</p>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {filteredProjects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardImage}>
                      <div className={styles.imagePlaceholder}>
                        {project.name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                    </div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.projectTitle}>{project.name}</h3>
                      
                      <div className={styles.projectDescription}>
                        {expandedDescriptions[project.id] ? (
                          <>
                            <p>{project.description}</p>
                            <button 
                              className={styles.toggleDescription}
                              onClick={() => toggleDescription(project.id)}
                            >
                              Ver menos
                            </button>
                          </>
                        ) : (
                          <>
                            <p>
                              {project.description.length > 100 
                                ? `${project.description.substring(0, 100)}...` 
                                : project.description
                              }
                            </p>
                            {project.description.length > 100 && (
                              <button 
                                className={styles.toggleDescription}
                                onClick={() => toggleDescription(project.id)}
                              >
                                Ver más...
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className={styles.projectMeta}>
                        <span className={styles.category}>{project.category}</span>
                        <span className={styles.timeInMarket}>
                          {project.timeInMarket} en el mercado
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Ingresos/mes</span>
                      <span className={styles.statValue}>
                        {formatCurrencyShort(project.monthlyRevenue)}
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Empleados</span>
                      <span className={styles.statValue}>{project.employees}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Clientes</span>
                      <span className={styles.statValue}>{project.clients}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.entrepreneurInfo}>
                      <span className={styles.entrepreneurName}>
                        {project.entrepreneur.name}
                      </span>
                      <span className={styles.foundedYear}>
                        Fundado en {project.founded}
                      </span>
                    </div>
                    <button 
                      className={styles.contactBtn}
                      onClick={() => handleContactClick(project)}
                    >
                      Contactar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ContactEntrepreneurModal
        isOpen={contactModal.isOpen}
        project={contactModal.project}
        onClose={handleContactClose}
        onSuccess={handleContactSuccess}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <ProjectsPageContent />
    </ProtectedRoute>
  );
}