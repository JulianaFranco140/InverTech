'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '../../hooks/useRegister.js';
import styles from './page.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rol_id: null
  });

  const { register, isLoading, error } = useRegister();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (rol_id) => {
    setFormData(prev => ({
      ...prev,
      rol_id
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Crear cuenta</h2>
          <p className={styles.formSubtitle}>Únete a la revolución del financiamiento inteligente</p>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.roleSelection}>
            <button
              type="button"
              onClick={() => handleRoleChange(2)}
              className={`${styles.roleCard} ${formData.rol_id === 2 ? styles.roleCardActive : ''}`}
            >
              <div className={styles.roleIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 7H21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M6 20H8M7 19V21" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="15" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M14 20H16M15 19V21" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <span className={styles.roleLabel}>Inversionista</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange(1)}
              className={`${styles.roleCard} ${formData.rol_id === 1 ? styles.roleCardActive : ''}`}
            >
              <div className={styles.roleIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 16.5C4.5 16.5 5.5 7.5 12 4C18.5 7.5 19.5 16.5 19.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M9 16.5L8 19L10 18L8.5 20.5L11 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 16.5L16 19L14 18L15.5 20.5L13 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.roleLabel}>Emprendedor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <p className={styles.loginLink}>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.rightContent}>
          <Link href="/" className={styles.backButton}>
            ← Volver a inicio
          </Link>
          <div className={styles.logoSection}>
            <h1 className={styles.logoTitle}>InverTech</h1>
            <h2 className={styles.welcomeTitle}>Únete a Nuestra Comunidad</h2>
          </div>
          
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <h3 className={styles.benefitTitle}>Proceso seguro:</h3>
              <p className={styles.benefitText}>Verificación completa y encriptación de datos.</p>
            </div>
            
            <div className={styles.benefit}>
              <h3 className={styles.benefitTitle}>IA personalizada:</h3>
              <p className={styles.benefitText}>Recomendaciones adaptadas a tu perfil.</p>
            </div>
            
            <div className={styles.benefit}>
              <h3 className={styles.benefitTitle}>Educación continua:</h3>
              <p className={styles.benefitText}>Aprende mientras inviertes o emprendes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}