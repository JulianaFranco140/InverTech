'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const handleGoToAIChat = () => {
    router.push('/investor/ai-chat');
  };

  const handleViewOpportunityDetails = (opportunityId) => {
    // Navegar a la página de oportunidades con el ID específico
    router.push(`/opportunities?highlight=${opportunityId}`);
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
          <div className={styles.aiChatSection}>
            <div className={styles.aiChatCard}>
              <div className={styles.aiChatIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" fill="currentColor"/>
                  <path d="M12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
                  <path d="M12 14C13.1046 14 14 14.8954 14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14Z" fill="currentColor"/>
                  <path d="M6 8C7.10457 8 8 8.89543 8 10C8 11.1046 7.10457 12 6 12C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8Z" fill="currentColor"/>
                  <path d="M18 8C19.1046 8 20 8.89543 20 10C20 11.1046 19.1046 12 18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.aiChatContent}>
                <h3 className={styles.aiChatTitle}>¿Quieres recibir mejor información?</h3>
                <p className={styles.aiChatSubtitle}>
                  Obtén análisis personalizados, recomendaciones de inversión y respuestas a tus preguntas financieras con nuestro asistente de IA especializado.
                </p>
                <div className={styles.aiChatFeatures}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C10.9289 21 9.92295 20.7947 9.01275 20.4246L4 21L5.57538 15.9872C5.20532 15.077 5 14.0711 5 13C5 8.02944 9.02944 4 14 4C18.9706 4 21 8.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>Análisis de mercado en tiempo real</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3V18C3 19.1046 3.89543 20 5 20H21M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="7" cy="16" r="2" fill="currentColor"/>
                        <circle cx="12" cy="11" r="2" fill="currentColor"/>
                        <circle cx="16" cy="15" r="2" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Recomendaciones personalizadas</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Estrategias de inversión optimizadas</span>
                  </div>
                </div>
                <button 
                  className={styles.aiChatButton}
                  onClick={handleGoToAIChat}
                >
                  <span className={styles.buttonIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
                    </svg>
                  </span>
                  Chatear con IA
                </button>
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
                  <button 
                    className={styles.detailsBtn}
                    onClick={() => handleViewOpportunityDetails(opp.id)}
                  >
                    Ver Detalles
                  </button>
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