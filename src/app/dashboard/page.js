'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import InvestorSidebar from '../../components/InvestorSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import MetricCard from '../../components/MetricCard';
import NotificationsModal from '../../components/NotificationsModal'; 
import styles from './page.module.css';
import {useAuth} from '../../hooks/useAuth';
import { useMyContactRequests } from '../../hooks/useMyContactRequests';
import { useOpportunities } from '../../hooks/useOpportunities';

function DashboardPageContent() {

  const {user, isLoading:userLoading} = useAuth();
  const { solicitudes, isLoading: solicitudesLoading, fetchSolicitudes } = useMyContactRequests();
  const { opportunities, isLoading: opportunitiesLoading, fetchOpportunities } = useOpportunities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user && !userLoading) {
      fetchSolicitudes();
      fetchOpportunities();
    }
  }, [user, userLoading]); 

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
      return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  const getRiskLevel = (investment, roi) => {
    if (!roi || roi === 'N/A') {
      return { risk: 'Medio', riskColor: 'blue' };
    }

    const roiNumeric = parseFloat(roi.replace('%', ''));
    
    if (roiNumeric < 10) {
      return { risk: 'Bajo', riskColor: 'green' };
    } else if (roiNumeric < 20) {
      return { risk: 'Medio', riskColor: 'blue' };
    } else {
      return { risk: 'Alto', riskColor: 'orange' };
    }
  };

  const totalInteresExpresado = solicitudes.reduce((sum, sol) => sum + (sol.montoInversion || 0), 0);
  
  const inversionesActivas = solicitudes.filter(sol => 
    sol.estado !== 'pendiente' && sol.estado !== 'rechazada'
  ).length;

  const metricsData = [
    {
      label: 'Portafolio Total',
      value: formatCurrencyShort(totalInteresExpresado),
      change: 'Interés expresado',
      isPositive: true
    },
    {
      label: 'Inversiones Activas',
      value: inversionesActivas.toString(),
      change: 'En proceso o aceptadas',
      isPositive: true
    },
    {
      label: 'Riesgo Promedio',
      value: 'Alto',
      subtext: 'Portafolio diversificado'
    }
  ];

  if (userLoading || solicitudesLoading || opportunitiesLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <InvestorSidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.dashboardContainer}>
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
    <div className={styles.dashboardContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader
          title={`¡Hola, ${user?.name || 'Inversionista'}!`}
          subtitle="Gestiona tu portafolio y descubre nuevas oportunidades de inversión"
          userType="investor"
          primaryButtonText="Actualizar"
          primaryButtonAction={() => window.location.reload()} 
          notificationCount={10}
          onNotificationClick={() => setShowNotifications(true)} 
        />

        <div className={styles.metricsGrid}>
          {metricsData.map((metric, index) => (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              subtext={metric.subtext}
              change={metric.change}
              isPositive={metric.isPositive}
            />
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Rendimiento del Portfolio</h2>
            <p className={styles.sectionSubtitle}>Últimos 12 meses</p>
            <div className={styles.chartPlaceholder}>
              <p className={styles.chartText}>Gráfico de Rendimiento</p>
              <p className={styles.chartSubtext}>Integración con biblioteca de gráficos</p>
              <div className={styles.performanceIndicators}>
                <div className={styles.indicator}>
                  <span className={styles.indicatorValue}>+28.5%</span>
                  <span className={styles.indicatorLabel}>Mejor mes</span>
                </div>
                <div className={styles.indicator}>
                  <span className={styles.indicatorValue}>-8.2%</span>
                  <span className={styles.indicatorLabel}>Peor mes</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.opportunitiesSection}>
            <h2 className={styles.sectionTitle}>Oportunidades Recomendadas</h2>
            <p className={styles.sectionSubtitle}>Basado en tu perfil de riesgo</p>
            
            <div className={styles.opportunitiesList}>
              {opportunities.map((opp) => (
                <div key={opp.id} className={styles.opportunityCard}>
                  <div className={styles.oppHeader}>
                    <h3 className={styles.oppName}>{opp.name}</h3>
                    <span className={`${styles.riskBadge} ${styles[opp.riskColor]}`}>
                      {opp.risk} Riesgo
                    </span>
                  </div>
                  <p className={styles.oppDescription}>{opp.description}</p>
                  <div className={styles.oppDetails}>
                    <div className={styles.oppDetail}>
                      <span className={styles.oppLabel}>Meta:</span>
                      <span className={styles.oppValue}>{formatCurrencyShort(opp.investment)}</span>
                    </div>
                    <div className={styles.oppDetail}>
                      <span className={styles.oppLabel}>ROI:</span>
                      <span className={styles.oppValue}>{opp.roi}</span>
                    </div>
                  </div>
                  <button className={styles.detailsBtn}>Ver Detalles</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}