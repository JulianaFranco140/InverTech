"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInvestorRequests } from "../../../hooks/useInvestorRequests";
import EntrepreneurSidebar from "../../../components/EntrepreneurSidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import styles from "./page.module.css";

export default function InvestorsPage() {
  const router = useRouter();
  const {
    solicitudes: investors,
    estadisticas,
    isLoading,
    error,
    fetchSolicitudes,
    actualizarEstado,
  } = useInvestorRequests();

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleEstadoChange = async (solicitudId, nuevoEstado) => {
    try {
      await actualizarEstado(solicitudId, nuevoEstado);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleContactar = async (investor) => {
    try {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        alert("Debes iniciar sesión");
        return;
      }

      // Crear chat en la base de datos
      const response = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inversionistaId: investor.inversionista.id,
          solicitudId: investor.id,
          tipoSolicitud: "contacto",
          emprendimientoId: investor.emprendimiento.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirigir a la página de chats
        router.push("/entrepreneur/chats");
      } else {
        console.error("Error al crear chat:", data.error);
        alert("Error al crear el chat: " + data.error);
      }
    } catch (error) {
      console.error("Error al contactar:", error);
      alert("Error al crear el chat");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvestment = investors.reduce(
    (sum, investor) => sum + (investor.montoInversion || 0),
    0
  );
  const averageInvestment =
    investors.length > 0 ? totalInvestment / investors.length : 0;

  const getAsuntoLabel = (asunto) => {
    const asuntoMap = {
      investment: "Propuesta de Inversión",
      partnership: "Propuesta de Sociedad",
      collaboration: "Colaboración",
      mentoring: "Mentoría",
      other: "Otro",
    };
    return asuntoMap[asunto] || asunto;
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <EntrepreneurSidebar />
        <div className={styles.mainContent}>
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EntrepreneurSidebar />
      <div className={styles.mainContent}>
        <DashboardHeader
          title="Inversionistas Interesados"
          subtitle="Gestiona las relaciones con inversionistas potenciales"
          userType="entrepreneur"
        />

        <div className={styles.summaryStats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{investors.length}</div>
            <div className={styles.statLabel}>Inversionistas Totales</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {formatCurrency(totalInvestment)}
            </div>
            <div className={styles.statLabel}>Inversión Total Potencial</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {formatCurrency(averageInvestment)}
            </div>
            <div className={styles.statLabel}>Inversión Promedio</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {
                investors.filter(
                  (inv) => inv.estado === "proceso" || inv.estado === "revision"
                ).length
              }
            </div>
            <div className={styles.statLabel}>En Proceso Activo</div>
          </div>
        </div>

        <div className={styles.investorsGrid}>
          {investors.map((investor) => (
            <div key={investor.id} className={styles.investorCard}>
              <div className={styles.projectHeader}>
                <h4 className={styles.projectName}>
                  {" "}
                  {investor.emprendimiento.nombre}
                </h4>
              </div>

              <div className={styles.investorHeader}>
                <div className={styles.investorAvatar}>
                  {investor.inversionista.nombre.charAt(0).toUpperCase()}
                </div>
                <div className={styles.investorInfo}>
                  <h3 className={styles.investorName}>
                    {investor.inversionista.nombre}
                  </h3>
                  <p className={styles.investorCompany}>
                    {investor.inversionista.email}
                  </p>
                  <span className={styles.investorType}>
                    {getAsuntoLabel(investor.asunto)}
                  </span>
                </div>
              </div>

              <div className={styles.investorContent}>
                <p className={styles.investorDescription}>{investor.mensaje}</p>

                {investor.montoInversion > 0 && (
                  <div className={styles.investmentAmount}>
                    <span className={styles.investmentLabel}>
                      Inversión Potencial:
                    </span>
                    <span className={styles.investmentValue}>
                      {formatCurrency(investor.montoInversion)}
                    </span>
                  </div>
                )}

                {investor.especializaciones.length > 0 && (
                  <div className={styles.specializations}>
                    <span className={styles.specializationLabel}>
                      Especialización:
                    </span>
                    <div className={styles.specializationTags}>
                      {investor.especializaciones.map((spec, index) => (
                        <span key={index} className={styles.specializationTag}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.investorActions}>
                <button
                  className={styles.contactBtn}
                  onClick={() => handleContactar(investor)}
                >
                  Contactar
                </button>
                <button className={styles.viewProfileBtn}>
                  Programar Reunión
                </button>
                <select
                  value={investor.estado}
                  onChange={(e) =>
                    handleEstadoChange(investor.id, e.target.value)
                  }
                  className={styles.viewProfileBtn}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="revision">En Revisión</option>
                  <option value="proceso">En Proceso</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
