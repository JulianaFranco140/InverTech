"use client";

import { useState, useEffect, useRef } from "react";
import InvestorSidebar from "../../../components/InvestorSidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import ProtectedRoute from "../../../components/ProtectedRoute";
import styles from "./page.module.css";

function AIChatPageContent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    const userMessage = {
      role: "user",
      content: newMessage,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setNewMessage("");
    setIsSending(true);

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("No hay sesión activa");
      }

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar mensaje");
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);

      const errorMessage = {
        role: "assistant",
        content: `Lo siento, ocurrió un error: ${error.message}. Por favor intenta de nuevo.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <InvestorSidebar />
      <div className={styles.mainContent}>
        <DashboardHeader title="Chat de Asistencia" />

        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2>Asistente Virtual InverTech</h2>
            <p className={styles.chatSubtitle}>
              Obtén ayuda e información sobre emprendimientos, inversores y más
            </p>
          </div>

          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <h3>Inicia una conversación</h3>
                <p>Pregunta lo que necesites y obtén respuestas instantáneas</p>
                <div className={styles.suggestions}>
                  <p className={styles.suggestionsTitle}>
                    Ejemplos de preguntas:
                  </p>
                  <button
                    onClick={() =>
                      setNewMessage(
                        "¿Cuáles son los emprendimientos más recientes?"
                      )
                    }
                    className={styles.suggestionBtn}
                  >
                    Emprendimientos recientes
                  </button>
                  <button
                    onClick={() => setNewMessage("Muéstrame mis estadísticas")}
                    className={styles.suggestionBtn}
                  >
                    Mis estadísticas
                  </button>
                  <button
                    onClick={() =>
                      setNewMessage("¿Qué conversaciones tengo activas?")
                    }
                    className={styles.suggestionBtn}
                  >
                    Mis conversaciones
                  </button>
                  <button
                    onClick={() =>
                      setNewMessage("Buscar emprendimientos de tecnología")
                    }
                    className={styles.suggestionBtn}
                  >
                    Emprendimientos de tecnología
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`${styles.messageWrapper} ${
                      message.role === "user"
                        ? styles.userMessage
                        : styles.botMessage
                    }`}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>
                        {message.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < message.content.split("\n").length - 1 && (
                              <br />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
            {isSending && (
              <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={styles.messageInput}
              disabled={isSending}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  return (
    <ProtectedRoute allowedRoles={[2]}>
      <AIChatPageContent />
    </ProtectedRoute>
  );
}
