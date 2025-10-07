'use client';
import styles from './MetricCard.module.css';

export default function MetricCard({ 
  label, 
  value, 
  subtext, 
  change, 
  isPositive = true,
  variant = 'default' 
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricContent}>
        <div className={styles.metricLabel}>{label}</div>
        <div className={styles.metricValue}>{value}</div>
        {subtext && (
          <div className={styles.metricSubtext}>
            {subtext}
          </div>
        )}
        {change && (
          <div className={`${styles.metricChange} ${isPositive ? styles.positive : styles.negative}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}