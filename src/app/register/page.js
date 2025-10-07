'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Inversionista'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica de registro
    console.log('Register attempt:', formData);
  };

  return (
    <div className={styles.registerContainer}>
      {/* Lado izquierdo - Formulario */}
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Crear cuenta</h2>
          <p className={styles.formSubtitle}>Únete a la revolución del financiamiento inteligente</p>

          {/* Botones de rol con iconos */}
          <div className={styles.roleSelection}>
            <button
              type="button"
              onClick={() => handleRoleChange('Inversionista')}
              className={`${styles.roleCard} ${formData.role === 'Inversionista' ? styles.roleCardActive : ''}`}
            >
              <div className={styles.roleIcon}>
                <span className={styles.iconInvestor}></span>
              </div>
              <span className={styles.roleLabel}>Inversionista</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('Emprendedor')}
              className={`${styles.roleCard} ${formData.role === 'Emprendedor' ? styles.roleCardActive : ''}`}
            >
              <div className={styles.roleIcon}>
                <span className={styles.iconEntrepreneur}></span>
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
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Crear mi cuenta
            </button>
          </form>

          <p className={styles.loginLink}>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      {/* Lado derecho - Azul */}
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