'use client';

import { useState } from 'react';
import EntrepreneurSidebar from '../../components/EntrepreneurSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import MetricCard from '../../components/MetricCard';
import FundingModal from '../../components/FundingModal';
import styles from './page.module.css';

export default function EntrepreneurDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [projects] = useState([
    {
      id: 1,
      name: "TechFlow Solutions",
      description: "Plataforma SaaS de automatización financiera para PyMEs",
      status: "Activo",
      riskLevel: "Riesgo Bajo",
      score: "92/100",
      startDate: "2023-01-15",
      financiamiento: {
        total: 800000000, // COP
        objetivo: 1200000000, // COP
        porcentaje: 66.67
      },
      inversionistas: {
        total: 12,
        cambio: "+3 este mes"
      },
      revenue: {
        mensual: 75000000, // COP
        cambio: "+25% vs mes anterior"
      },
      valoracion: {
        estimada: 2500000000, // COP
        metodo: "por IA"
      },
      employees: 12,
      clients: 150
    },
    {
      id: 2,
      name: "EcoVerde Packaging",
      description: "Empaques biodegradables para industria alimentaria",
      status: "Crecimiento",
      riskLevel: "Riesgo Medio",
      score: "78/100",
      startDate: "2022-08-20",
      financiamiento: {
        total: 300000000, // COP
        objetivo: 500000000, // COP
        porcentaje: 60
      },
      inversionistas: {
        total: 5,
        cambio: "+1 este mes"
      },
      revenue: {
        mensual: 18000000, // COP
        cambio: "+12% vs mes anterior"
      },
      valoracion: {
        estimada: 800000000, // COP
        metodo: "por IA"
      },
      employees: 8,
      clients: 45
    }
  ]);

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

  const calculateTimeInMarket = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
    } else {
      return `${months} mes${months !== 1 ? 'es' : ''}`;
    }
  };

  // Calcular métricas totales
  const totalFunding = projects.reduce((sum, project) => sum + project.financiamiento.total, 0);
  const totalObjective = projects.reduce((sum, project) => sum + project.financiamiento.objetivo, 0);
  const totalInvestors = projects.reduce((sum, project) => sum + project.inversionistas.total, 0);
  const totalRevenue = projects.reduce((sum, project) => sum + project.revenue.mensual, 0);
  const totalValuation = projects.reduce((sum, project) => sum + project.valoracion.estimada, 0);
  const totalEmployees = projects.reduce((sum, project) => sum + project.employees, 0);
  const totalClients = projects.reduce((sum, project) => sum + project.clients, 0);

  const metricsData = [
    {
      label: 'Financiamiento Total',
      value: formatCurrencyShort(totalFunding),
      subtext: `de ${formatCurrencyShort(totalObjective)} objetivo`
    },
    {
      label: 'Inversionistas',
      value: totalInvestors.toString(),
      change: "+4 este mes",
      isPositive: true
    },
    {
      label: 'Revenue Mensual',
      value: formatCurrencyShort(totalRevenue),
      change: "+20% vs mes anterior",
      isPositive: true
    },
    {
      label: 'Valoración Total',
      value: formatCurrencyShort(totalValuation),
      subtext: "Estimada por IA"
    }
  ];

  const handleRequestFunding = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      <div className={styles.mainContent}>
        <DashboardHeader
          title="¡Hola, Juliana Franco!"
          subtitle={`Gestiona tus ${projects.length} emprendimientos y haz crecer tu portafolio`}
          userType="entrepreneur"
          primaryButtonText="+ Solicitar Financiamiento"
          primaryButtonAction={handleRequestFunding}
          secondaryButtonText="Actualizar"
          notificationCount={3}
        />

        <div className={styles.dashboardContent}>
          <div className={styles.summarySection}>
            <h2>Resumen de Portafolio</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Proyectos Activos</span>
                <span className={styles.summaryValue}>{projects.length}</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Empleados Total</span>
                <span className={styles.summaryValue}>{totalEmployees}</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Clientes Total</span>
                <span className={styles.summaryValue}>{totalClients}</span>
              </div>
            </div>
          </div>

          {/* Tarjetas de Proyectos */}
          <div className={styles.projectsSection}>
            <h2>Mis Emprendimientos</h2>
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectInfo}>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className={styles.projectTags}>
                        <span className={`${styles.statusTag} ${styles[project.status.toLowerCase()]}`}>
                          {project.status}
                        </span>
                        <span className={styles.riskTag}>{project.riskLevel}</span>
                        <span className={styles.timeTag}>
                          {calculateTimeInMarket(project.startDate)} en mercado
                        </span>
                      </div>
                    </div>
                    
                  </div>
                  
                  <div className={styles.fundingProgress}>
                    <div className={styles.fundingInfo}>
                      <span className={styles.fundingCurrent}>
                        {formatCurrency(project.financiamiento.total)}
                      </span>
                      <span className={styles.fundingTarget}>
                        de {formatCurrency(project.financiamiento.objetivo)} objetivo
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${project.financiamiento.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.projectMetrics}>
                    <div className={styles.projectMetric}>
                      <span className={styles.metricValue}>{project.inversionistas.total}</span>
                      <span className={styles.metricLabel}>Inversionistas</span>
                    </div>
                    <div className={styles.projectMetric}>
                      <span className={styles.metricValue}>{formatCurrencyShort(project.revenue.mensual)}</span>
                      <span className={styles.metricLabel}>Revenue/mes</span>
                    </div>
                    <div className={styles.projectMetric}>
                      <span className={styles.metricValue}>{project.employees}</span>
                      <span className={styles.metricLabel}>Empleados</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Métricas Globales */}
          <div className={styles.metricsSection}>
            <h2>Métricas Generales</h2>
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
          </div>
        </div>
      </div>

      <FundingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}