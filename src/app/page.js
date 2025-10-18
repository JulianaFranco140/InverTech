'use client';

import Header from '../components/Header';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Conectamos inversión inteligente con Emprendimientos
            </h1>
            <p className={styles.heroDescription}>
              Plataforma de financiamiento basada en análisis de riesgo que une inversionistas con emprendedores exitosos. Accede a educación financiera personalizada y simulaciones avanzadas.
            </p>
            <div className={styles.heroButtons}>
              <a href="#inversionistas" className={styles.inversionistaBtn}>
                Soy inversionista
              </a>
              <a href="#emprendedores" className={styles.emprendedorBtn}>
                Soy emprendedor
              </a>
            </div>
          </div>
        </div>

        <section id="inversionistas" className={styles.roleSection}>
          <div className={styles.roleSectionContent}>
            <div className={styles.roleHeader}>
              <div className={styles.roleIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 7H21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="15" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <h2 className={styles.roleTitle}>Para Inversionistas</h2>
              <p className={styles.roleSubtitle}>
                Encuentra las mejores oportunidades de inversión con análisis de riesgo inteligente
              </p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M12 1V3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 21V23" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4.22 4.22L5.64 5.64" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.36 18.36L19.78 19.78" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 12H3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21 12H23" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4.22 19.78L5.64 18.36" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.36 5.64L19.78 4.22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Análisis de riesgo con IA</h3>
                <p>Evaluaciones automáticas y precisas de cada emprendimiento basadas en algoritmos avanzados</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M7 8H17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 12H17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 16H13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Dashboard personalizado</h3>
                <p>Métricas y rendimiento de tu portafolio en tiempo real con reportes detallados</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M11 8A3 3 0 0 1 14 11" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Marketplace de oportunidades</h3>
                <p>Acceso exclusivo a emprendimientos verificados y pre-evaluados por nuestro sistema</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V9H9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12A9 9 0 0 0 6 5.3L3 9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21V15H15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12A9 9 0 0 0 18 18.7L21 15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Simulaciones de inversión</h3>
                <p>Proyecciones de ROI personalizadas con diferentes escenarios de mercado</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3H8A4 4 0 0 1 12 7V21A3 3 0 0 0 9 18H2V3Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 3H16A4 4 0 0 0 12 7V21A3 3 0 0 1 15 18H22V3Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Educación financiera</h3>
                <p>Cursos especializados y recursos para mejorar tus decisiones de inversión</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.investorIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19A4 4 0 0 0 13 15H5A4 4 0 0 0 1 19V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M23 21V19A4 4 0 0 0 19 15H19" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13A4 4 0 0 1 16 11.87" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Red de networking</h3>
                <p>Conecta con otros inversionistas y comparte experiencias en nuestra comunidad</p>
              </div>
            </div>

            <div className={styles.roleCTA}>
              <a href="/register?role=investor" className={styles.ctaButton}>
                Registrarme como Inversionista
              </a>
              <p className={styles.ctaSubtext}>
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
              </p>
            </div>
          </div>
        </section>

        <section id="emprendedores" className={styles.roleSection}>
          <div className={styles.roleSectionContent}>
            <div className={styles.roleHeader}>
              <div className={styles.roleIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className={styles.roleTitle}>Para Emprendedores</h2>
              <p className={styles.roleSubtitle}>
                Conecta tu proyecto con inversionistas estratégicos y haz crecer tu startup
              </p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 5H9.5A3.5 3.5 0 0 0 6 8.5V8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5V15.5A3.5 3.5 0 0 1 14.5 19H6" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Solicitud de financiamiento</h3>
                <p>Proceso simplificado y rápido para presentar tu emprendimiento a inversionistas</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Gestión de proyectos</h3>
                <p>Dashboard completo para administrar todos tus emprendimientos desde un solo lugar</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8A6 6 0 1 1 4 8C4 4.5 7 2 12 2S20 4.5 20 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 14H22" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 14V20A2 2 0 0 0 8 22H16A2 2 0 0 0 18 20V14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Conexión con inversionistas</h3>
                <p>Acceso directo a capital estratégico y inversionistas alineados con tu industria</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Análisis de viabilidad</h3>
                <p>Nuestra IA evalúa el potencial de tu proyecto y sugiere mejoras estratégicas</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" stroke="#10B981" strokeWidth="2"/>
                    <path d="M19.4 15A1.65 1.65 0 0 0 21 13.35A1.65 1.65 0 0 0 19.4 11.65A1.65 1.65 0 0 0 18 13A1.65 1.65 0 0 0 19.4 15Z" stroke="#10B981" strokeWidth="2"/>
                    <path d="M4.6 9A1.65 1.65 0 0 0 6 7.35A1.65 1.65 0 0 0 4.6 5.65A1.65 1.65 0 0 0 3 7.3A1.65 1.65 0 0 0 4.6 9Z" stroke="#10B981" strokeWidth="2"/>
                    <path d="M12 2L13.09 8.26L19 7L14.64 11.36L21 13L14.64 14.64L15 21L12 15.74L9 21L9.36 14.64L3 13L9.36 11.36L5 7L10.91 8.26L12 2Z" stroke="#10B981" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
                <h3>Mentorías especializadas</h3>
                <p>Guidance personalizado de expertos en tu industria y modelo de negocio</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${styles.entrepreneurIcon}`}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 7H16" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 11H16" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 15H12" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Recursos empresariales</h3>
                <p>Herramientas y conocimientos esenciales para hacer crecer tu startup exitosamente</p>
              </div>
            </div>

            <div className={styles.roleCTA}>
              <a href="/register?role=entrepreneur" className={styles.ctaButton}>
                Registrarme como Emprendedor
              </a>
              <p className={styles.ctaSubtext}>
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
