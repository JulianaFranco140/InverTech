'use client';

import { useState } from 'react';
import EntrepreneurSidebar from '../../../components/EntrepreneurSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import styles from './page.module.css';

export default function InvestorsPage() {
  const [investors] = useState([
    {
      id: 1,
      name: 'María González',
      type: 'Angel Investor',
      company: 'TechVentures Colombia',
      investment: 150000,
      interest: 'high',
      status: 'pending',
      specialization: ['Tecnología', 'Fintech'],
      avatar: 'MG',
      description: 'Inversionista especializada en startups de tecnología financiera con más de 10 años de experiencia.',
      email: 'maria.gonzalez@techventures.co'
    },
    {
      id: 2,
      name: 'Carlos Rodriguez',
      type: 'Venture Capital',
      company: 'Innovation Capital',
      investment: 300000,
      interest: 'very_high',
      status: 'negotiating',
      specialization: ['SaaS', 'B2B'],
      avatar: 'CR',
      description: 'Partner en Innovation Capital, fondo especializado en soluciones B2B y software empresarial.',
      email: 'carlos.rodriguez@innovationcapital.com'
    },
    {
      id: 3,
      name: 'Ana Morales',
      type: 'Corporate Investor',
      company: 'Banco Popular',
      investment: 500000,
      interest: 'high',
      status: 'interested',
      specialization: ['Fintech', 'Automatización'],
      avatar: 'AM',
      description: 'Directora de Innovación en Banco Popular, enfocada en soluciones de automatización bancaria.',
      email: 'ana.morales@bancopopular.co'
    },
    {
      id: 4,
      name: 'Luis Herrera',
      type: 'Angel Investor',
      company: 'Independent',
      investment: 75000,
      interest: 'medium',
      status: 'considering',
      specialization: ['Startups', 'Tecnología'],
      avatar: 'LH',
      description: 'Ex-fundador de startup exitosa, ahora invierte en emprendimientos tecnológicos emergentes.',
      email: 'luis.herrera@email.com'
    },
    {
      id: 5,
      name: 'Sofia Castro',
      type: 'Venture Capital',
      company: 'Emerging Markets Fund',
      investment: 400000,
      interest: 'very_high',
      status: 'meeting_scheduled',
      specialization: ['Mercados Emergentes', 'Scale-up'],
      avatar: 'SC',
      description: 'Managing Partner en fondo especializado en scale-ups de mercados emergentes latinoamericanos.',
      email: 'sofia.castro@emfund.com'
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

  const getInterestBadge = (interest) => {
    const badges = {
      very_high: { text: 'Muy Alto', color: 'success' },
      high: { text: 'Alto', color: 'primary' },
      medium: { text: 'Medio', color: 'warning' },
      low: { text: 'Bajo', color: 'neutral' }
    };
    return badges[interest] || badges.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', color: 'neutral' },
      interested: { text: 'Interesado', color: 'primary' },
      negotiating: { text: 'Negociando', color: 'warning' },
      considering: { text: 'Considerando', color: 'info' },
      meeting_scheduled: { text: 'Reunión Programada', color: 'success' }
    };
    return badges[status] || badges.pending;
  };

  const totalInvestment = investors.reduce((sum, investor) => sum + investor.investment, 0);
  const averageInvestment = totalInvestment / investors.length;

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      <div className={styles.mainContent}>
        <DashboardHeader
          title="Inversionistas Interesados"
          subtitle="Gestiona las relaciones con inversionistas potenciales"
          userType="entrepreneur"
        />

        <div className={styles.summaryStats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{investors.length}</div>
            <div className={styles.statLabel}>Inversionistas Totales</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{formatCurrency(totalInvestment)}</div>
            <div className={styles.statLabel}>Inversión Total Potencial</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{formatCurrency(averageInvestment)}</div>
            <div className={styles.statLabel}>Inversión Promedio</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {investors.filter(inv => inv.status === 'negotiating' || inv.status === 'meeting_scheduled').length}
            </div>
            <div className={styles.statLabel}>En Proceso Activo</div>
          </div>
        </div>

        {/* Lista de Inversionistas */}
        <div className={styles.investorsGrid}>
          {investors.map((investor) => (
            <div key={investor.id} className={styles.investorCard}>
              <div className={styles.investorHeader}>
                <div className={styles.investorAvatar}>
                  {investor.avatar}
                </div>
                <div className={styles.investorInfo}>
                  <h3 className={styles.investorName}>{investor.name}</h3>
                  <p className={styles.investorCompany}>{investor.company}</p>
                  <span className={styles.investorType}>{investor.type}</span>
                </div>
                <div className={styles.investorBadges}>
                  <span className={`${styles.badge} ${styles[getInterestBadge(investor.interest).color]}`}>
                    {getInterestBadge(investor.interest).text}
                  </span>
                  <span className={`${styles.badge} ${styles[getStatusBadge(investor.status).color]}`}>
                    {getStatusBadge(investor.status).text}
                  </span>
                </div>
              </div>

              <div className={styles.investorContent}>
                <p className={styles.investorDescription}>{investor.description}</p>
                
                <div className={styles.investmentAmount}>
                  <span className={styles.investmentLabel}>Inversión Potencial:</span>
                  <span className={styles.investmentValue}>{formatCurrency(investor.investment)}</span>
                </div>

                <div className={styles.specializations}>
                  <span className={styles.specializationLabel}>Especialización:</span>
                  <div className={styles.specializationTags}>
                    {investor.specialization.map((spec, index) => (
                      <span key={index} className={styles.specializationTag}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.lastContact}>
                  <span>Último contacto: {new Date(investor.lastContact).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              <div className={styles.investorActions}>
                <button className={styles.contactBtn}>
                  Contactar
                </button>
                <button className={styles.scheduleBtn}>
                  Programar Reunión
                </button>
                <button className={styles.viewProfileBtn}>
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}