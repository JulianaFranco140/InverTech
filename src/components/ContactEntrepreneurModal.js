'use client';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './ContactEntrepreneurModal.module.css';

export default function ContactEntrepreneurModal({ isOpen, onClose, project }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    investmentAmount: '',
    specializations: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const specializationOptions = [
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'sostenibilidad', label: 'Sostenibilidad' },
    { value: 'salud', label: 'Salud' },
    { value: 'educacion', label: 'Educación' },
    { value: 'agricultura', label: 'Agricultura' },
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'biotecnologia', label: 'Biotecnología' },
    { value: 'energia', label: 'Energía' },
    { value: 'logistica', label: 'Logística' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'turismo', label: 'Turismo' },
    { value: 'medios', label: 'Medios y Comunicación' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (specializationValue) => {
    setFormData(prev => {
      const currentSpecializations = prev.specializations;
      const isSelected = currentSpecializations.includes(specializationValue);
      
      if (isSelected) {
        return {
          ...prev,
          specializations: currentSpecializations.filter(spec => spec !== specializationValue)
        };
      } else {
        return {
          ...prev,
          specializations: [...currentSpecializations, specializationValue]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Enviando mensaje con especializaciones:', formData.specializations);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      message: '',
      investmentAmount: '',
      specializations: [] 
    });
    setShowSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {showSuccess ? (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <h3>¡Mensaje enviado exitosamente!</h3>
            <p>Tu solicitud de contacto ha sido enviada a {project.entrepreneur.name}.</p>
            <p>Te contactarán pronto con la información sobre tus especializaciones.</p>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2>Contactar Emprendedor</h2>
              <button className={styles.closeButton} onClick={handleClose}>×</button>
            </div>

            <div className={styles.projectInfo}>
              <div className={styles.projectAvatar}>
                {project.name?.charAt(0) || 'P'}
              </div>
              <div className={styles.projectDetails}>
                <h3>{project.name}</h3>
                <p>{project.entrepreneur.name}</p>
                <div className={styles.projectStats}>
                  <span>{project.category}</span>
                  <span>{formatCurrency(project.monthlyRevenue)}/mes</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Asunto</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="investment">Propuesta de Inversión</option>
                  <option value="partnership">Propuesta de Sociedad</option>
                  <option value="collaboration">Colaboración</option>
                  <option value="mentoring">Mentoría</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="investmentAmount">Monto de Inversión Interesado (Opcional)</label>
                <input
                  type="number"
                  id="investmentAmount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  placeholder="Ej: 50000000"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Áreas de Especialización</label>
                <p className={styles.fieldDescription}>
                  Selecciona una o varias áreas en las que tienes experiencia como inversionista
                </p>
                <div className={styles.specializationsGrid}>
                  {specializationOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${styles.specializationChip} ${
                        formData.specializations.includes(option.value) ? styles.selected : ''
                      }`}
                      onClick={() => handleSpecializationChange(option.value)}
                    >
                      <span className={styles.chipIcon}>
                        {formData.specializations.includes(option.value) ? '✓' : '+'}
                      </span>
                      {option.label}
                    </div>
                  ))}
                </div>
                {formData.specializations.length > 0 && (
                  <div className={styles.selectedCount}>
                    {formData.specializations.length} especialización{formData.specializations.length > 1 ? 'es' : ''} seleccionada{formData.specializations.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={`Hola ${project.entrepreneur.name}, me interesa tu proyecto "${project.name}" y me gustaría conversar sobre una posible colaboración...`}
                  rows={6}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  onClick={handleClose}
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}