'use client';

import { useState, useEffect } from 'react';
import { useEmprendimientos } from '../hooks/useEmprendimientos';
import NotificacionModal from './NotificacionModal';
import styles from './FundingModal.module.css';
import { getToken, createAuthHeaders } from '../lib/tokenUtils';

export default function FundingModal({ isOpen, onClose, onSuccess }) {
  const { emprendimientos, isLoading } = useEmprendimientos();
  
  const [formState, setFormState] = useState({
    amount: '',
    revenue: '',
    type: '',
    emprendimiento_id: '',
    purpose: '',
    timeline: '',
    documents: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {

  }, [emprendimientos]);

  const fundingTypes = [
    'Capital de Riesgo',
    'Préstamo',
    'Deuda Convertible'
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!validTypes.includes(file.type)) {
        showNotification(
          'warning',
          'Tipo de archivo no válido',
          `El archivo "${file.name}" no es válido. Solo se permiten PDF, DOC, DOCX e imágenes.`,
          true
        );
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) { 
        showNotification(
          'warning',
          'Archivo muy grande',
          `El archivo "${file.name}" es muy grande. El tamaño máximo es 10MB.`,
          true
        );
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setFormState(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles].slice(0, 5)
      }));
      
      if (validFiles.length < files.length) {
        showNotification(
          'info',
          'Algunos archivos omitidos',
          'Algunos archivos no fueron agregados por no cumplir con los requisitos.',
          true
        );
      }
    }
  };

  const removeFile = (index) => {
    setFormState(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {

      const token = getToken();
      
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append('emprendimiento_id', formState.emprendimiento_id);
      formDataToSend.append('amount', formState.amount);
      formDataToSend.append('revenue', formState.revenue);
      formDataToSend.append('type', formState.type);
      formDataToSend.append('purpose', formState.purpose);
      formDataToSend.append('timeline', formState.timeline);
      

      formState.documents.forEach((file, index) => {
        formDataToSend.append('documents', file);
      });


      const response = await fetch('/api/solicitudes-financiamiento', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // No usar createAuthHeaders aquí porque es FormData
        },
        body: formDataToSend
      });


      const result = await response.json();
      

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la solicitud');
      }

      const proyecto = emprendimientos.find(p => p.id_emprendimiento == formState.emprendimiento_id);
      const nombreProyecto = proyecto ? proyecto.nombre : 'tu proyecto';
      
      const montoFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(formState.amount);
      
      
      showNotification(
        'success',
        '¡Solicitud enviada exitosamente! ',
        `Tu solicitud de financiamiento ${formState.type} por ${montoFormateado} para "${nombreProyecto}" ha sido registrada correctamente.`,
        false
      );
      
      onSuccess?.(result);
      
      setTimeout(() => {
        handleCancel();
      }, 4000);
      
    } catch (error) {
      setSubmitError(error.message);
      showNotification(
        'error',
        'Error al enviar la solicitud',
        `No se pudo procesar tu solicitud: ${error.message}. Por favor, verifica los datos e intenta nuevamente.`,
        false
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormState({
      amount: '',
      revenue: '',
      type: '',
      emprendimiento_id: '',
      purpose: '',
      timeline: '',
      documents: []
    });
    setSubmitError(null);
    setNotification({ isOpen: false, type: 'info', title: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={handleCancel}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Solicitar Financiamiento</h2>
            <button className={styles.closeButton} onClick={handleCancel}>×</button>
          </div>

          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="amount">Monto Solicitado (COP)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formState.amount}
                  onChange={handleInputChange}
                  placeholder="50000000"
                  min="1000000"
                  step="1000000"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="revenue">Ganancia neta anual (COP)</label>
                <input
                  type="number"
                  id="revenue"
                  name="revenue"
                  value={formState.revenue} 
                  onChange={handleInputChange}
                  placeholder="25000000"
                  min="0"
                  step="1000000"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo de Financiamiento</label>
                <select
                  id="type"
                  name="type"
                  value={formState.type}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar...</option>
                  {fundingTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
   
              <div className={styles.formGroup}>
                <label htmlFor="emprendimiento_id">Proyecto a Financiar</label>
                <select
                  id="emprendimiento_id"
                  name="emprendimiento_id"
                  value={formState.emprendimiento_id} 
                  onChange={(e) => {

                    handleInputChange(e);
                  }}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">
                    {isLoading ? "Cargando proyectos..." : "Selecciona un proyecto"}
                  </option>
                  {!isLoading && emprendimientos && emprendimientos.length > 0 ? (
                    emprendimientos.map((proyecto) => (
                      <option key={proyecto.id_emprendimiento} value={proyecto.id_emprendimiento}>
                        {proyecto.nombre}
                      </option>
                    ))
                  ) : (
                    !isLoading && (
                      <option value="" disabled>
                        No tienes proyectos registrados
                      </option>
                    )
                  )}
                </select>
                {!isLoading && emprendimientos && emprendimientos.length === 0 && (
                  <small className={styles.helpText}>
                    Primero debes registrar un proyecto en la sección "Mis Proyectos"
                  </small>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="purpose">Propósito del Financiamiento</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formState.purpose}
                onChange={handleInputChange}
                placeholder="Describe para qué utilizarás el financiamiento..."
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline">Cronograma de Uso de Fondos</label>
              <textarea
                id="timeline"
                name="timeline"
                value={formState.timeline} 
                onChange={handleInputChange}
                placeholder="Detalla cómo y cuándo planeas usar los fondos..."
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Documentos de Respaldo (máximo 5 archivos, 10MB cada uno)</label>
              <div 
                className={`${styles.fileUpload} ${dragActive ? styles.dragActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className={styles.fileInput}
                  disabled={isSubmitting}
                />
                <div className={styles.uploadIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p>
                  <span>Arrastra archivos aquí</span> o{' '}
                  <span className={styles.browseText}>explora</span>
                </p>
                <p className={styles.fileTypes}>PDF, DOC, DOCX, JPG, PNG</p>
              </div>
              
              {formState.documents.length > 0 && (
                <div className={styles.fileList}>
                  {formState.documents.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className={styles.removeFileBtn}
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <div className={styles.errorMessage}>
                {submitError}
              </div>
            )}

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className={styles.submitButton}
                disabled={
                  !formState.amount || 
                  !formState.type || 
                  !formState.emprendimiento_id || 
                  !formState.purpose || 
                  !formState.timeline ||
                  isSubmitting ||
                  (!isLoading && emprendimientos.length === 0)
                }
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Enviando solicitud...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <NotificacionModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        autoClose={notification.type === 'success' || notification.type === 'info'}
        autoCloseTime={notification.type === 'success' ? 4000 : 5000}
      />
    </>
  );
}