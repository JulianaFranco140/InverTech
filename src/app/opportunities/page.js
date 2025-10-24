'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useOpportunities } from '../../hooks/useOpportunities';
import InvestorSidebar from '../../components/InvestorSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

function OpportunitiesPageContent() {
  const { user, isLoading: userLoading } = useAuth();
  const { 
    opportunities, 
    isLoading, 
    error, 
    fetchOpportunities, 
    filterByRisk, 
    searchOpportunities 
  } = useOpportunities();
  
  const [selectedRisk, setSelectedRisk] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const riskLevels = ['Todos', 'Bajo', 'Medio', 'Alto'];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterByRisk(selectedRisk);
  }, [selectedRisk]);

  useEffect(() => {
    searchOpportunities(searchTerm);
  }, [searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColorClass = (risk) => {
    switch (risk) {
      case 'Bajo': return 'green';
      case 'Medio': return 'blue';
      case 'Alto': return 'orange';
      default: return 'blue';
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className={styles.opportunitiesContainer}>
        <InvestorSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Cargando oportunidades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.opportunitiesContainer}>
        <InvestorSidebar />
        <div className={styles.mainContent}>
          <div className={styles.errorState}>
            <p>Error: {error}</p>
            <button onClick={fetchOpportunities} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.opportunitiesContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleSection}>
              <Link href="/dashboard" className={styles.backLink}>
                ← Volver al Dashboard
              </Link>
              <h1 className={styles.pageTitle}>Oportunidades de Inversión</h1>
              <p className={styles.pageSubtitle}>
                Descubre los mejores emprendimientos para invertir tu capital
              </p>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{opportunities.length}</span>
                <span className={styles.statLabel}>Oportunidades</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  $COP {opportunities.reduce((sum, opp) => sum + (opp.investment || 0), 0).toLocaleString()}
                </span>
                <span className={styles.statLabel}>Capital total</span>
              </div>
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.filters}>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="Todos">Todos los riesgos</option>
                {riskLevels.slice(1).map(risk => (
                  <option key={risk} value={risk}>Riesgo {risk}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {opportunities.length === 0 ? 
                'No se encontraron oportunidades' : 
                `${opportunities.length} oportunidad${opportunities.length !== 1 ? 'es' : ''} encontrada${opportunities.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>

          {opportunities.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No hay oportunidades disponibles</h3>
              <p>No se encontraron solicitudes de financiamiento activas.</p>
            </div>
          ) : (
            <div className={styles.opportunitiesGrid}>
              {opportunities.map(opportunity => (
                <div key={opportunity.id} className={styles.opportunityCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardImage}>
                      <div className={styles.imagePlaceholder}>
                        {opportunity.category?.charAt(0) || opportunity.name?.charAt(0) || 'E'}
                      </div>
                      <span className={`${styles.riskBadge} ${styles[getRiskColorClass(opportunity.risk)]}`}>
                        {opportunity.risk}
                      </span>
                    </div>
                    <div className={styles.cardTitle}>
                      <h3 className={styles.opportunityName}>{opportunity.name}</h3>
                      <p className={styles.opportunityLocation}>
                        por {opportunity.emprendedor} • {opportunity.category}
                      </p>
                    </div>
                  </div>

                  <p className={styles.opportunityDescription}>
                    {opportunity.description}
                  </p>

                  <div className={styles.opportunityTags}>
                    {opportunity.tags?.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.opportunityMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Inversión objetivo</span>
                      <span className={styles.metricValue}>
                        {formatCurrency(opportunity.investment)}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>ROI esperado</span>
                      <span className={styles.metricValue}>{opportunity.roi}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Tipo</span>
                      <span className={styles.metricValue}>
                        {opportunity.tipoFinanciamiento || 'No especificado'}
                      </span>
                    </div>
                  </div>

                  {opportunity.proposito && (
                    <div className={styles.purposeSection}>
                      <div className={styles.purposeLabel}>Propósito:</div>
                      <p className={styles.purposeText}>
                        {opportunity.proposito.length > 120 ? 
                          `${opportunity.proposito.substring(0, 120)}...` : 
                          opportunity.proposito
                        }
                      </p>
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <button className={styles.detailsBtn}>
                      Ver Detalles
                    </button>
                    <button className={styles.investBtn}>
                      Invertir Ahora
                    </button>
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

export default function OpportunitiesPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <OpportunitiesPageContent />
    </ProtectedRoute>
  );
}