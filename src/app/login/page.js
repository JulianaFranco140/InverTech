'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    // Aquí iría la lógica de autenticación
    console.log('Login attempt:', formData);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSide}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backButton}>
            ← Volver a inicio
          </Link>
          <div className={styles.logoSection}>
            <h1 className={styles.logoTitle}>InverTech</h1>
            <h2 className={styles.welcomeTitle}>Bienvenido de vuelta</h2>
          </div>
          <p className={styles.description}>
            Accede a tu dashboard personalizado y continúa construyendo tu futuro financiero con nuestra plataforma inteligente.
          </p>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Iniciar sesión</h2>
          <p className={styles.formSubtitle}>Ingresa a tu cuenta de InverTech</p>

          <form onSubmit={handleSubmit} className={styles.form}>
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

            
            <button type="submit" className={styles.submitButton}>
              Iniciar sesión
            </button>
          </form>

          <p className={styles.registerLink}>
            ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}