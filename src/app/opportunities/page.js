'use client';
import { useState } from 'react';
import Link from 'next/link';
import InvestorSidebar from '../../components/InvestorSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

function OpportunitiesPageContent() {
  const [selectedRisk, setSelectedRisk] = useState('Todos');

  const riskLevels = ['Todos', 'Bajo', 'Medio', 'Alto'];

  const opportunities = [
    {
      id: 1,
      name: 'EcoTech Solutions',
      description: 'Tecnología verde para el procesamiento inteligente de residuos urbanos con IA',
      category: 'Sostenibilidad',
      investment: 300000000,
      roi: '8-12%',
      risk: 'Bajo',
      riskColor: 'green',
      duration: '24 meses',
      funded: 45,
      goal: 100,
      investors: 12,
      founded: '2023',
      location: 'Bogotá, Colombia',
      tags: ['IA', 'Sostenibilidad', 'Tecnología'],
      image: '/placeholder-eco.jpg'
    },
    {
      id: 2,
      name: 'FinApp Innovations',
      description: 'Aplicación móvil para gestión financiera personal con análisis predictivo',
      category: 'Fintech',
      investment: 600000000,
      roi: '15-20%',
      risk: 'Medio',
      riskColor: 'blue',
      duration: '36 meses',
      funded: 78,
      goal: 100,
      investors: 24,
      founded: '2022',
      location: 'Medellín, Colombia',
      tags: ['Fintech', 'Mobile', 'IA'],
      image: '/placeholder-finapp.jpg'
    },
    {
      id: 3,
      name: 'HealthTech Analytics',
      description: 'Plataforma de análisis de datos médicos para diagnósticos tempranos',
      category: 'Salud',
      investment: 800000000,
      roi: '18-25%',
      risk: 'Alto',
      riskColor: 'orange',
      duration: '48 meses',
      funded: 30,
      goal: 100,
      investors: 8,
      founded: '2024',
      location: 'Cali, Colombia',
      tags: ['Salud', 'Big Data', 'IA'],
      image: '/placeholder-health.jpg'
    },
    {
      id: 4,
      name: 'EduPlatform Pro',
      description: 'Plataforma educativa online con realidad virtual para aprendizaje inmersivo',
      category: 'Educación',
      investment: 400000000,
      roi: '12-18%',
      risk: 'Medio',
      riskColor: 'blue',
      duration: '30 meses',
      funded: 65,
      goal: 100,
      investors: 18,
      founded: '2023',
      location: 'Barranquilla, Colombia',
      tags: ['Educación', 'VR', 'EdTech'],
      image: '/placeholder-edu.jpg'
    },
    {
      id: 5,
      name: 'SmartCommerce AI',
      description: 'Solución de e-commerce con inteligencia artificial para personalización',
      category: 'E-commerce',
      investment: 480000000,
      roi: '14-22%',
      risk: 'Medio',
      riskColor: 'blue',
      duration: '32 meses',
      funded: 55,
      goal: 100,
      investors: 15,
      founded: '2023',
      location: 'Cartagena, Colombia',
      tags: ['E-commerce', 'IA', 'Retail'],
      image: '/placeholder-commerce.jpg'
    },
    {
      id: 6,
      name: 'GreenEnergy Startup',
      description: 'Desarrollo de paneles solares de nueva generación con 40% más eficiencia',
      category: 'Sostenibilidad',
      investment: 1200000000,
      roi: '10-15%',
      risk: 'Bajo',
      riskColor: 'green',
      duration: '60 meses',
      funded: 25,
      goal: 100,
      investors: 5,
      founded: '2024',
      location: 'Bucaramanga, Colombia',
      tags: ['Energía', 'Sostenibilidad', 'Innovación'],
      image: '/placeholder-energy.jpg'
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesRisk = selectedRisk === 'Todos' || opp.risk === selectedRisk;
    return matchesRisk;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
              <span className={styles.statNumber}>$COP {opportunities.reduce((sum, opp) => sum + opp.investment, 0).toLocaleString()}</span>
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
            {filteredOpportunities.length} oportunidades encontradas
          </span>
        </div>

        <div className={styles.opportunitiesGrid}>
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity.id} className={styles.opportunityCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>
                    {opportunity.category.charAt(0)}
                  </div>
                  <span className={`${styles.riskBadge} ${styles[opportunity.riskColor]}`}>
                    {opportunity.risk}
                  </span>
                </div>
                <div className={styles.cardTitle}>
                  <h3 className={styles.opportunityName}>{opportunity.name}</h3>
                  <p className={styles.opportunityLocation}>{opportunity.location}</p>
                </div>
              </div>

              <p className={styles.opportunityDescription}>
                {opportunity.description}
              </p>

              <div className={styles.opportunityTags}>
                {opportunity.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.opportunityMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Inversión objetivo</span>
                  <span className={styles.metricValue}>{formatCurrency(opportunity.investment)}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>ROI esperado</span>
                  <span className={styles.metricValue}>{opportunity.roi}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Duración</span>
                  <span className={styles.metricValue}>{opportunity.duration}</span>
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progreso de financiación</span>
                  <span className={styles.progressPercent}>{opportunity.funded}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${opportunity.funded}%` }}
                  ></div>
                </div>
                <div className={styles.progressInfo}>
                  <span className={styles.investors}>{opportunity.investors} inversores</span>
                  <span className={styles.founded}>Fundada en {opportunity.founded}</span>
                </div>
              </div>

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