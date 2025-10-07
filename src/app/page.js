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
              <button className={styles.inversionistaBtn}>Soy inversionista</button>
              <button className={styles.emprendedorBtn}>Soy emprendedor</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
