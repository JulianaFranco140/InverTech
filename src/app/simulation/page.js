'use client';

import { useState } from 'react';
import InvestorSidebar from '../../components/InvestorSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

function SimulationPageContent() {
  const [formData, setFormData] = useState({
    amount: '',
    term: '',
    riskLevel: 'medium',
    projectType: ''
  });

  const [results, setResults] = useState(null);

  const riskProfiles = {
    low: { rate: 8, risk: 'Bajo', description: 'Inversiones conservadoras con menor volatilidad' },
    medium: { rate: 12, risk: 'Medio', description: 'Balance entre rentabilidad y riesgo' },
    high: { rate: 18, risk: 'Alto', description: 'Mayor potencial de ganancia con más volatilidad' }
  };

  const projectTypes = {
    inmobiliario: { multiplier: 1.0, name: 'Inmobiliario' },
    tecnologia: { multiplier: 1.2, name: 'Tecnología' },
    energia: { multiplier: 1.1, name: 'Energía Renovable' },
    agricultura: { multiplier: 0.9, name: 'Agricultura' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSimulation = () => {
    const amount = parseFloat(formData.amount);
    const term = parseInt(formData.term);
    const baseRate = riskProfiles[formData.riskLevel].rate;
    const multiplier = projectTypes[formData.projectType].multiplier;
    
    const adjustedRate = baseRate * multiplier;
    const monthlyRate = adjustedRate / 100 / 12;
    

    const finalAmount = amount * Math.pow(1 + monthlyRate, term);
    const totalGains = finalAmount - amount;
    const roi = (totalGains / amount) * 100;

    const conservativeRate = adjustedRate * 0.7;
    const optimisticRate = adjustedRate * 1.3;
    
    const conservativeAmount = amount * Math.pow(1 + conservativeRate / 100 / 12, term);
    const optimisticAmount = amount * Math.pow(1 + optimisticRate / 100 / 12, term);

    setResults({
      initialAmount: amount,
      term,
      rate: adjustedRate,
      finalAmount,
      totalGains,
      roi,
      monthlyGains: totalGains / term,
      scenarios: {
        conservative: {
          amount: conservativeAmount,
          gains: conservativeAmount - amount
        },
        realistic: {
          amount: finalAmount,
          gains: totalGains
        },
        optimistic: {
          amount: optimisticAmount,
          gains: optimisticAmount - amount
        }
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.pageContainer}>
      <InvestorSidebar />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Simulador de Inversión</h1>
          <p>Simula tu inversión y visualiza los posibles retornos antes de decidir</p>
        </div>

        <div className={styles.simulationContainer}>
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <h2>Parámetros de Simulación</h2>
              
              <div className={styles.inputGroup}>
                <label htmlFor="amount">Monto a Invertir</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Ej: 5000000"
                  min="100000"
                  step="100000"
                />
                <span className={styles.inputHint}>Mínimo: $100,000 COP</span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="term">Plazo de Inversión</label>
                <select
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Selecciona un plazo</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                  <option value="18">18 meses</option>
                  <option value="24">24 meses</option>
                  <option value="36">36 meses</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Nivel de Riesgo</label>
                <div className={styles.riskOptions}>
                  {Object.entries(riskProfiles).map(([key, profile]) => (
                    <label key={key} className={styles.riskOption}>
                      <input
                        type="radio"
                        name="riskLevel"
                        value={key}
                        checked={formData.riskLevel === key}
                        onChange={handleInputChange}
                      />
                      <div className={styles.riskCard}>
                        <span className={styles.riskLevel}>{profile.risk}</span>
                        <span className={styles.riskRate}>~{profile.rate}% anual</span>
                        <span className={styles.riskDescription}>{profile.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="projectType">Tipo de Proyecto</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Selecciona un tipo de proyecto</option>
                  {Object.entries(projectTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>

              <button
                className={styles.simulateButton}
                onClick={calculateSimulation}
                disabled={!formData.amount || formData.amount < 100000 || !formData.term || !formData.projectType}
              >
                Simular Inversión
              </button>
            </div>
          </div>

          {results && (
            <div className={styles.resultsSection}>
              <div className={styles.resultsCard}>
                <h2>Resultados de la Simulación</h2>
                
                <div className={styles.mainResults}>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Inversión Inicial</span>
                    <span className={styles.resultValue}>{formatCurrency(results.initialAmount)}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Monto Final Proyectado</span>
                    <span className={styles.resultValue}>{formatCurrency(results.finalAmount)}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Ganancias Totales</span>
                    <span className={`${styles.resultValue} ${styles.positive}`}>
                      +{formatCurrency(results.totalGains)}
                    </span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>ROI</span>
                    <span className={`${styles.resultValue} ${styles.positive}`}>
                      {results.roi.toFixed(2)}%
                    </span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Ganancia Mensual Promedio</span>
                    <span className={styles.resultValue}>{formatCurrency(results.monthlyGains)}</span>
                  </div>
                </div>

                <div className={styles.scenarios}>
                  <h3>Escenarios de Proyección</h3>
                  <div className={styles.scenarioCards}>
                    <div className={styles.scenarioCard}>
                      <h4>Conservador</h4>
                      <div className={styles.scenarioAmount}>
                        {formatCurrency(results.scenarios.conservative.amount)}
                      </div>
                      <div className={styles.scenarioGains}>
                        +{formatCurrency(results.scenarios.conservative.gains)}
                      </div>
                    </div>
                    <div className={`${styles.scenarioCard} ${styles.realistic}`}>
                      <h4>Realista</h4>
                      <div className={styles.scenarioAmount}>
                        {formatCurrency(results.scenarios.realistic.amount)}
                      </div>
                      <div className={styles.scenarioGains}>
                        +{formatCurrency(results.scenarios.realistic.gains)}
                      </div>
                    </div>
                    <div className={styles.scenarioCard}>
                      <h4>Optimista</h4>
                      <div className={styles.scenarioAmount}>
                        {formatCurrency(results.scenarios.optimistic.amount)}
                      </div>
                      <div className={styles.scenarioGains}>
                        +{formatCurrency(results.scenarios.optimistic.gains)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <p><strong>Importante:</strong> Esta simulación es una proyección basada en datos históricos y estimaciones. Los resultados reales pueden variar según las condiciones del mercado y el desempeño específico de cada proyecto.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <SimulationPageContent />
    </ProtectedRoute>
  );
}