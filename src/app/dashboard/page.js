'use client';
import { useState } from 'react';
import InvestorSidebar from '../../components/InvestorSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import MetricCard from '../../components/MetricCard';
import styles from './page.module.css';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const metricsData = [
    {
      label: 'Portfolio Total',
      value: formatCurrencyShort(1000000000),
      change: '+12.5% vs mes anterior',
      isPositive: true
    },
    {
      label: 'Retorno Anual',
      value: '15.8%',
      change: '+2.3% vs objetivo anual',
      isPositive: true
    },
    {
      label: 'Inversiones Activas',
      value: '12',
      change: '+3 este mes',
      isPositive: true
    },
    {
      label: 'Riesgo Promedio',
      value: 'Medio',
      subtext: 'Portafolio diversificado'
    }
  ];

  const opportunities = [
    {
      name: 'EcoTech Solutions',
      description: 'Tecnología verde para el procesamiento de residuos',
      investment: '$300.000.000',
      roi: '8-12%',
      risk: 'Bajo',
      riskColor: 'green'
    },
    {
      name: 'FinApp Innovations',
      description: 'Aplicación móvil para gestión financiera personal',
      investment: '$600.000.000',
      roi: '15-20%',
      risk: 'Medio',
      riskColor: 'blue'
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <InvestorSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader
          title="Bienvenido, Demo Inversionista"
          subtitle="Gestiona tu portafolio y descubre nuevas oportunidades de inversión"
          userType="investor"
          primaryButtonText="Actualizar"
          notificationCount={1}
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
              {opportunities.map((opp, index) => (
                <div key={index} className={styles.opportunityCard}>
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
                      <span className={styles.oppValue}>{opp.investment}</span>
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
    </div>
  );
}