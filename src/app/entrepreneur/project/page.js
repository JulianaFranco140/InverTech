'use client';

import { useState } from 'react';
import EntrepreneurSidebar from '../../../components/EntrepreneurSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import styles from './page.module.css';

export default function MyProjectPage() {
  const [userName] = useState('Ana María Rodríguez'); // En producción vendría del sistema de auth
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'TechFlow Solutions',
      description: 'Plataforma SaaS que automatiza procesos de facturación y gestión financiera para PyMEs colombianas. Utilizamos IA para predecir flujos de caja y optimizar cobros.',
      startDate: '2023-01-15',
      capital: 150000000, // COP
      category: 'Tecnología',
      status: 'Activo',
      employees: 12,
      clients: 85,
      monthlyRevenue: 25000000
    },
    {
      id: 2,
      name: 'EcoVerde Packaging',
      description: 'Empresa de empaques biodegradables para la industria alimentaria. Creamos soluciones sostenibles que reducen el impacto ambiental.',
      startDate: '2022-08-20',
      capital: 80000000, // COP
      category: 'Sostenibilidad',
      status: 'Crecimiento',
      employees: 8,
      clients: 45,
      monthlyRevenue: 18000000
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    capital: '',
    category: ''
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  const handleAddProject = (e) => {
    e.preventDefault();
    
    const project = {
      id: projects.length + 1,
      ...newProject,
      capital: parseInt(newProject.capital.replace(/[^0-9]/g, '')),
      status: 'En Desarrollo',
      employees: 1,
      clients: 0,
      monthlyRevenue: 0
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      startDate: '',
      capital: '',
      category: ''
    });
    setShowNewProjectForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const totalCapital = projects.reduce((sum, project) => sum + project.capital, 0);
  const totalEmployees = projects.reduce((sum, project) => sum + project.employees, 0);
  const totalClients = projects.reduce((sum, project) => sum + project.clients, 0);
  const totalMonthlyRevenue = projects.reduce((sum, project) => sum + project.monthlyRevenue, 0);

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader
          title={`Mis Proyectos - ${userName}`}
          subtitle="Gestiona y supervisa todos tus emprendimientos"
          userType="entrepreneur"
        />

        {/* Botón para agregar nuevo proyecto */}
        <div className={styles.addProjectSection}>
          <button 
            className={styles.addProjectBtn}
            onClick={() => setShowNewProjectForm(true)}
          >
            + Agregar Nuevo Emprendimiento
          </button>
        </div>

        {/* Estadísticas Generales */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Proyectos</h3>
            <div className={styles.statValue}>{projects.length}</div>
            <span className={styles.statLabel}>emprendimientos</span>
          </div>
          <div className={styles.statCard}>
            <h3>Capital Total</h3>
            <div className={styles.statValue}>{formatCurrency(totalCapital)}</div>
            <span className={styles.statLabel}>invertido</span>
          </div>
          <div className={styles.statCard}>
            <h3>Empleados</h3>
            <div className={styles.statValue}>{totalEmployees}</div>
            <span className={styles.statLabel}>colaboradores</span>
          </div>
          <div className={styles.statCard}>
            <h3>Ingresos Mensuales</h3>
            <div className={styles.statValue}>{formatCurrency(totalMonthlyRevenue)}</div>
            <span className={styles.statLabel}>promedio</span>
          </div>
        </div>

        {/* Lista de Proyectos */}
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.projectInfo}>
                  <h3>{project.name}</h3>
                  <div className={styles.projectMeta}>
                    <span className={`${styles.statusBadge} ${styles[project.status.toLowerCase().replace(' ', '')]}`}>
                      {project.status}
                    </span>
                    <span className={styles.category}>{project.category}</span>
                  </div>
                </div>
                <div className={styles.projectActions}>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteProject(project.id)}
                    title="Eliminar proyecto"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className={styles.projectDescription}>
                <p>{project.description}</p>
              </div>

              <div className={styles.projectDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Inicio:</span>
                  <span className={styles.detailValue}>
                    {new Date(project.startDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tiempo en Mercado:</span>
                  <span className={styles.detailValue}>
                    {calculateTimeInMarket(project.startDate)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capital Inicial:</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(project.capital)}
                  </span>
                </div>
              </div>

              <div className={styles.projectMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{project.employees}</span>
                  <span className={styles.metricLabel}>Empleados</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{project.clients}</span>
                  <span className={styles.metricLabel}>Clientes</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{formatCurrency(project.monthlyRevenue)}</span>
                  <span className={styles.metricLabel}>Ingresos/mes</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay proyectos */}
        {projects.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No tienes proyectos registrados</h3>
            <p>Comienza agregando tu primer emprendimiento</p>
            <button 
              className={styles.addFirstProjectBtn}
              onClick={() => setShowNewProjectForm(true)}
            >
              Agregar Mi Primer Proyecto
            </button>
          </div>
        )}

        {/* Modal para Nuevo Proyecto */}
        {showNewProjectForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Registrar Nuevo Emprendimiento</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowNewProjectForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddProject} className={styles.projectForm}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Nombre del Proyecto</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: TechSolutions Colombia"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Categoría</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Fintech">Fintech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Sostenibilidad">Sostenibilidad</option>
                      <option value="Salud">Salud</option>
                      <option value="Educación">Educación</option>
                      <option value="Agricultura">Agricultura</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Servicios">Servicios</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Fecha de Inicio del Proyecto</label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Capital Inicial (COP)</label>
                    <input
                      type="text"
                      value={newProject.capital}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = new Intl.NumberFormat('es-CO').format(value);
                        handleInputChange('capital', formatted);
                      }}
                      placeholder="Ej: 50,000,000"
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Descripción del Proyecto</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe de qué trata tu emprendimiento, qué problema resuelve y cuál es tu propuesta de valor..."
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setShowNewProjectForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Registrar Proyecto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}