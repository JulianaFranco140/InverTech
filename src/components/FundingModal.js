'use client';
import { useState } from 'react';
import styles from './FundingModal.module.css';

export default function FundingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    purpose: '',
    timeline: '',
    documents: []
  });

  const [dragActive, setDragActive] = useState(false);

  const fundingTypes = [
    'Capital de Riesgo',
    'Préstamo',
    'Deuda Convertible'
  ];

    const projectTypes = [
    'Proyecto 1',
    'Proyecto 2',
    'Proyecto 3'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    const newFiles = Array.from(files).slice(0, 5);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newFiles].slice(0, 5)
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud de financiamiento:', formData);
    // Aquí iría la lógica para enviar la solicitud
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      type: '',
      purpose: '',
      timeline: '',
      documents: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Solicitar Financiamiento</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="amount">Monto Solicitado ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="25,000"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Tipo de Financiamiento</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                {fundingTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Elige tu proyecto</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                {projectTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="purpose">Propósito del Financiamiento</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe para qué utilizarás el financiamiento..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="timeline">Cronograma de Uso de Fondos</label>
            <textarea
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              placeholder="Detalla cómo y cuándo planeas usar los fondos..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Documentos de Respaldo</label>
            <div 
              className={`${styles.fileUpload} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={styles.uploadIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C18.1046 10 19 10.8954 19 12V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V12C5 10.8954 5.89543 10 7 10Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.uploadText}>
                <p>Arrastra archivos aquí o haz clic para seleccionar</p>
                <span>PDF, Word, Excel - Máximo 10MB</span>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileInput}
                className={styles.fileInput}
              />
            </div>

            {formData.documents.length > 0 && (
              <div className={styles.fileList}>
                {formData.documents.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className={styles.removeFile}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={styles.submitButton}
              disabled={!formData.amount || !formData.type || !formData.purpose || !formData.timeline}
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}