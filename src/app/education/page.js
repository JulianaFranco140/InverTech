'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import InvestorSidebar from '../../components/InvestorSidebar';
import EntrepreneurSidebar from '../../components/EntrepreneurSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import styles from './page.module.css';

function EducationPageContent() {
  const { user } = useAuth();

  const educationContent = [
    {
      id: 1,
      title: "¿Qué es la educación financiera?",
      description: "La educación financiera es el proceso de aprender cómo manejar el dinero de manera efectiva.",
      category: "Introducción",
      duration: "1:15 min",
      url: "https://www.youtube.com/watch?v=E11IAD50C9E",
    },
    {
      id: 2,
      title: "¿Qué es una inversión?",
      description: "Conoce los conceptos básicos sobre inversiones, tipos de activos y cómo empezar a invertir tu dinero de manera inteligente.",
      category: "Vídeo",
      duration: "14:13 min",
      url: "https://www.youtube.com/watch?v=VnQlMaTos4o",
    },
    {
      id: 3,
      title: "Relación entre rentabilidad y riesgo",
      description: "Explora cómo equilibrar el riesgo y la rentabilidad en tus decisiones de inversión.",
      category: "Vídeo",
      duration: "0:37 min",
      url: "https://www.youtube.com/shorts/b0x1nRbQuNs",
      
    },
    {
      id: 4,
      title: "Educación financiera y decisiones de inversión",
      description: "Trabajo académico que explica cómo la educación financiera mejora la comprensión de productos e instrumentos financieros, ayuda a los inversionistas a asumir riesgos de forma consciente.",
      category: "Artículo",
      url: "https://repositorio.utb.edu.co/entities/publication/daf87819-658e-4cdd-9df1-145295fc6981",

    },
    {
      id: 5,
      title: "¿Qué es el ROI?",
      description: "Diccionario de términos financieros que explica el Retorno sobre la Inversión (ROI) y su importancia para evaluar la rentabilidad de las inversiones.",
      category: "Vídeo",
      duration: "3:33 min",
      url: "https://youtu.be/UgpTr62tNXw?si=UmyIsPbqNvnQVq2d",

    },
    {
      id: 6,
      title: "¿Qué es el VAN?",
      description: "Vídeo explicativo sobre el Valor Actual Neto (VAN) y su uso en la evaluación de proyectos de inversión.",
      category: "Vídeo",
      duration: "4:47 min",
      url: "https://youtu.be/nv4TQShwdSo?si=cZdf9DzrLofi4Xll",
    },
    {
      id: 7,
      title: "¿Qué es el TIR?",
      description: "Explicación del concepto de Tasa Interna de Retorno (TIR) y su aplicación en la toma de decisiones financieras.",
      category: "Vídeo",
      duration: "4:22 min",
      url: "https://youtu.be/C5SUOxpqHgM?si=jTTwZu2S0Gp27cGg",
    },
    {
      id: 8,
      title: "Concepto de capital semilla",
      description: "Cómo crear presentaciones que atraigan inversionistas.",
      category: "Vídeo",
      duration: "1:07 min",
      url: "https://youtu.be/FZCpq7KHHOw?si=CmNvRzNjl7Pf8goD",
    },
    {
      id: 9,
      title: "Conoce qué es un pitch y cuál es su importancia",
      description: "Vídeo que explica qué es un pitch, su importancia para emprendedores e inversionistas, y cómo preparar uno efectivo.",
      category: "Vídeo",
      duration: "1:07 min",
      url: "https://youtu.be/FZCpq7KHHOw?si=CmNvRzNjl7Pf8goD",
    }
  ];

  const [filteredContent, setFilteredContent] = useState(educationContent);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Vídeo', 'PDF', 'Artículo'];

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'Todos') {
      setFilteredContent(educationContent);
    } else {
      setFilteredContent(educationContent.filter(item => item.category === category));
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Introducción': return '#10b981';
      case 'Vídeo': return '#3b82f6';
      case 'PDF': return '#ef4444';
      case 'Artículo': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.pageContainer}>
      {user?.rol_id === 2 ? <InvestorSidebar /> : <EntrepreneurSidebar />}
      
      <div className={styles.mainContent}>
        <DashboardHeader 
          title="Educación Financiera"
          subtitle="Expande tus conocimientos financieros con recursos especializados"
        />

        <div className={styles.educationContent}>
          <div className={styles.filtersSection}>
            <h3 className={styles.filtersTitle}>Filtrar por categoría</h3>
            <div className={styles.categoryFilters}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => filterByCategory(category)}
                  className={`${styles.categoryBtn} ${
                    selectedCategory === category ? styles.categoryBtnActive : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{educationContent.length}</span>
              <span className={styles.statLabel}>Recursos disponibles</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{filteredContent.length}</span>
              <span className={styles.statLabel}>Recursos mostrados</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>Categorías</span>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {filteredContent.map(content => (
              <div key={content.id} className={styles.educationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{content.icon}</div>
                  <div className={styles.cardMeta}>
                    <span 
                      className={styles.categoryBadge}
                      style={{ backgroundColor: getCategoryColor(content.category) }}
                    >
                      {content.category}
                    </span>
                    <span className={styles.duration}>{content.duration}</span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{content.title}</h3>
                  <p className={styles.cardDescription}>{content.description}</p>
                </div>

                <div className={styles.cardActions}>
                  <button 
                    className={styles.accessBtn}
                    onClick={() => openExternalLink(content.url)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 13V19A2 2 0 0 1 16 21H5A2 2 0 0 1 3 19V8A2 2 0 0 1 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Acceder al recurso
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No se encontraron recursos</h3>
              <p>No hay contenido disponible para la categoría seleccionada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EducationPage() {
  return (
    <ProtectedRoute requiredRoles={[2, 3]}>
      <EducationPageContent />
    </ProtectedRoute>
  );
}