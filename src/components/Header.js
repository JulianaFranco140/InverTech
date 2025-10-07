import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}>Inver<span className={styles.span}>Tech</span></span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/login">
            <button className={styles.loginBtn}>Iniciar sesión</button>
          </Link>
          <Link href="/register">
            <button className={styles.registerBtn}>Registrarse</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}