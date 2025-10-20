'use client';

import { useState } from 'react';
import EntrepreneurSidebar from '../../../components/EntrepreneurSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import NotificacionModal from '../../../components/NotificacionModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useEmprendimientos } from '../../../hooks/useEmprendimientos.js';
import { useAuth } from '../../../hooks/useAuth.js';
import styles from './page.module.css';

export default function MyProjectPage() {
  const { user, isLoading: userLoading } = useAuth();
  const { emprendimientos, isLoading, error, createEmprendimiento, deleteEmprendimiento } = useEmprendimientos();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  

  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    projectId: null,
    projectName: '',
    isLoading: false
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    category: '',
    monthlyIncome: '',
    clients: '',
    employees: ''
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

  const showNotification = (type, title, message, autoClose = true) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
    
    if (autoClose) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
      }, 5000);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    
    try {
      const monthlyRevenueValue = parseInt(newProject.monthlyIncome.replace(/[^0-9]/g, '')) || 0;
      const clientsValue = parseInt(newProject.clients.replace(/[^0-9]/g, '')) || 0;
      const employeesValue = parseInt(newProject.employees.replace(/[^0-9]/g, '')) || 0;

      const emprendimientoData = {
        nombre: newProject.name,
        descripcion: newProject.description,
        categoria: newProject.category,
        ingresos_mensuales: monthlyRevenueValue,
        fecha_creacion: newProject.startDate,
        cantidad_empleados: employeesValue,
        cantidad_clientes: clientsValue
      };

      await createEmprendimiento(emprendimientoData);

      setNewProject({
        name: '',
        description: '',
        startDate: '',
        category: '',
        monthlyIncome: '',
        clients: '',
        employees: ''
      });
      setShowNewProjectForm(false);
      
      showNotification(
        'success',
        '¡Proyecto creado exitosamente!',
        `El proyecto "${newProject.name}" ha sido registrado correctamente.`
      );

    } catch (err) {
      showNotification(
        'error',
        'Error al crear el proyecto',
        `No se pudo crear el proyecto: ${err.message}`,
        false
      );
    }
  };

  const handleInputChange = (field, value) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteClick = (projectId) => {
    const project = emprendimientos.find(emp => emp.id_emprendimiento === projectId);
    const projectName = project ? project.nombre : 'el proyecto';
    
    setConfirmModal({
      isOpen: true,
      projectId,
      projectName,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.projectId) return;
    
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await deleteEmprendimiento(confirmModal.projectId);
      
      setConfirmModal({
        isOpen: false,
        projectId: null,
        projectName: '',
        isLoading: false
      });
      
      showNotification(
        'success',
        '¡Proyecto eliminado exitosamente!',
        result.message
      );
      
    } catch (err) {
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
      console.error('Error al eliminar emprendimiento:', err);
      

      if (err.message.includes('solicitudes de financiamiento en proceso activo')) {
        showNotification(
          'warning',
          'No se puede eliminar el proyecto',
          err.message,
          false
        );
      } else {
        showNotification(
          'error',
          'Error al eliminar el proyecto',
          `No se pudo eliminar el proyecto: ${err.message}`,
          false
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmModal({
      isOpen: false,
      projectId: null,
      projectName: '',
      isLoading: false
    });
  };

  const totalEmployees = emprendimientos.reduce((sum, project) => sum + (project.cantidad_empleados || 0), 0);
  const totalClients = emprendimientos.reduce((sum, project) => sum + (project.cantidad_clientes || 0), 0);
  const totalMonthlyRevenue = emprendimientos.reduce((sum, project) => sum + (project.ingresos_mensuales || 0), 0);

  if (userLoading || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Cargando tus proyectos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader
          title={`Mis Proyectos `}
          subtitle="Gestiona y supervisa todos tus emprendimientos"
          userType="entrepreneur"
        />

        <div className={styles.addProjectSection}>
          <button 
            className={styles.addProjectBtn}
            onClick={() => setShowNewProjectForm(true)}
          >
            + Agregar Nuevo Emprendimiento
          </button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Proyectos</h3>
            <div className={styles.statValue}>{emprendimientos.length}</div>
            <span className={styles.statLabel}>emprendimientos</span>
          </div>
          <div className={styles.statCard}>
            <h3>Empleados</h3>
            <div className={styles.statValue}>{totalEmployees}</div>
            <span className={styles.statLabel}>colaboradores</span>
          </div>
          <div className={styles.statCard}>
            <h3>Clientes</h3>
            <div className={styles.statValue}>{totalClients}</div>
            <span className={styles.statLabel}>clientes</span>
          </div>
        </div>

        <div className={styles.projectsGrid}>
          {emprendimientos.map((project) => (
            <div key={project.id_emprendimiento} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.projectInfo}>
                  <h3>{project.nombre}</h3>
                  <div className={styles.projectMeta}>
                    <span className={styles.category}>{project.categoria === 1 ? "Tecnología" : project.categoria === 2 ? "Fintech" : project.categoria === 3 ? "E-commerce" : project.categoria === 4 ? "Sostenibilidad" : project.categoria === 5 ? "Salud" : project.categoria === 6 ? "Educación" : project.categoria === 7 ? "Agricultura" : project.categoria === 8 ? "Alimentación" : "Servicios"}</span>
                  </div>
                </div>
                <div className={styles.projectActions}>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(project.id_emprendimiento)}
                    title="Eliminar proyecto"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className={styles.projectDescription}>
                <p>{project.descripcion}</p>
              </div>

              <div className={styles.projectDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Inicio:</span>
                  <span className={styles.detailValue}>
                    {new Date(project.fecha_creacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tiempo en Mercado:</span>
                  <span className={styles.detailValue}>
                    {calculateTimeInMarket(project.fecha_creacion)}
                  </span>
                </div>
              </div>

              <div className={styles.projectMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{project.cantidad_empleados}</span>
                  <span className={styles.metricLabel}>Empleados</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{project.cantidad_clientes}</span>
                  <span className={styles.metricLabel}>Clientes</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{formatCurrency(project.ingresos_mensuales)}</span>
                  <span className={styles.metricLabel}>Ingresos/mes</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {emprendimientos.length === 0 && (
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
                      <option value="1">Tecnología</option>
                      <option value="2">Fintech</option>
                      <option value="3">E-commerce</option>
                      <option value="4">Sostenibilidad</option>
                      <option value="5">Salud</option>
                      <option value="6">Educación</option>
                      <option value="7">Agricultura</option>
                      <option value="8">Alimentación</option>
                      <option value="9">Servicios</option>
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
                    <label>Ingresos mensuales (COP)</label>
                    <input
                      type="text"
                      value={newProject.monthlyIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = new Intl.NumberFormat('es-CO').format(value);
                        handleInputChange('monthlyIncome', formatted);
                      }}
                      placeholder="Ej: 50,000,000"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Clientes nuestros</label>
                    <input
                      type="text"
                      value={newProject.clients}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = new Intl.NumberFormat('es-CO').format(value);
                        handleInputChange('clients', formatted);
                      }}
                      placeholder="Ej: 100"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Empleados</label>
                    <input
                      type="text"
                      value={newProject.employees}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = new Intl.NumberFormat('es-CO').format(value);
                        handleInputChange('employees', formatted);
                      }}
                      placeholder="Ej: 50"
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

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type="danger"
        title="Eliminar Proyecto"
        message={`¿Estás seguro de que deseas eliminar "${confirmModal.projectName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={confirmModal.isLoading}
      />

      {/* Modal de notificaciones */}
      <NotificacionModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        autoClose={true}
        autoCloseTime={5000}
      />
    </div>
  );
}