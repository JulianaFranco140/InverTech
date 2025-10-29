"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InvestorSidebar from "../../../components/InvestorSidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import ProtectedRoute from "../../../components/ProtectedRoute";
import styles from "./page.module.css";

function ChatsPageContent() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    // Cargar chats desde la API
    const loadChats = async () => {
      try {
        const token = localStorage.getItem("auth-token");

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/chat", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Formatear los chats para el componente del inversionista
          const formattedChats = data.chats.map((chat) => ({
            id: chat.id_chat,
            emprendedor: {
              nombre: chat.emprendedor_nombre,
              email: chat.emprendedor_email,
            },
            emprendimiento: {
              nombre: chat.emprendimiento_nombre,
            },
            tipoSolicitud: chat.tipo_solicitud,
            ultimoMensaje: chat.ultimo_mensaje || "Sin mensajes",
            fechaUltimoMensaje: chat.fecha_ultimo_mensaje || chat.fecha_inicio,
            mensajesNoLeidos: parseInt(chat.mensajes_no_leidos) || 0,
            estado: chat.estado,
          }));

          setChats(formattedChats);
        } else {
          console.error("Error al cargar chats");
        }
      } catch (error) {
        console.error("Error al cargar chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markMessagesAsRead(selectedChat.id);

      // Poll para actualizar mensajes cada 3 segundos
      const interval = setInterval(() => {
        loadMessages(selectedChat.id);
      }, 3000);

      return () => clearInterval(interval);
    } else {
      // Limpiar mensajes cuando se deselecciona el chat
      setMessages([]);
    }
  }, [selectedChat]);

  const loadMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      // Solo mostrar estado de carga en la primera carga
      if (messages.length === 0) {
        setIsLoadingMessages(true);
      }

      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Evitar duplicados: solo actualizar si hay cambios
        setMessages((prevMessages) => {
          // Si no hay mensajes previos, usar los nuevos
          if (prevMessages.length === 0) return data.messages;

          // Si la cantidad de mensajes cambió, actualizar
          if (prevMessages.length !== data.messages.length)
            return data.messages;

          // Si el último mensaje es diferente, actualizar
          const lastPrev = prevMessages[prevMessages.length - 1];
          const lastNew = data.messages[data.messages.length - 1];
          if (lastPrev?.id_mensaje !== lastNew?.id_mensaje)
            return data.messages;

          // No hay cambios, mantener mensajes actuales
          return prevMessages;
        });
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      await fetch(`/api/chat/${chatId}/messages/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar el contador de mensajes no leídos en la lista
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, mensajesNoLeidos: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending || !selectedChat) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      const response = await fetch(`/api/chat/${selectedChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje: newMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");

        // Actualizar el último mensaje en la lista de chats
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChat.id
              ? {
                  ...chat,
                  ultimoMensaje: newMessage,
                  fechaUltimoMensaje: new Date().toISOString(),
                }
              : chat
          )
        );
      } else {
        alert("Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar mensaje");
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.pageContainer}>
      <InvestorSidebar />

      <div className={styles.mainContent}>
        <DashboardHeader
          title="Mis Chats"
          subtitle="Comunícate directamente con emprendedores"
          userType="investor"
        />

        <div className={styles.chatsContainer}>
          <div className={styles.chatsList}>
            <div className={styles.chatsHeader}>
              <h3>Conversaciones Activas</h3>
              <span className={styles.chatsCount}>
                {chats.length} chat{chats.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className={styles.emptyState}>
                <h4>No tienes chats activos</h4>
                <p>
                  Cuando contactes a emprendedores, las conversaciones
                  aparecerán aquí.
                </p>
                <Link href="/projects" className={styles.viewProjectsBtn}>
                  Explorar Proyectos
                </Link>
              </div>
            ) : (
              <div className={styles.chatItems}>
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`${styles.chatItem} ${
                      selectedChat?.id === chat.id ? styles.chatItemActive : ""
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className={styles.chatItemHeader}>
                      <div className={styles.chatAvatar}>
                        {chat.emprendedor.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.chatInfo}>
                        <h4 className={styles.chatEntrepreneurName}>
                          {chat.emprendedor.nombre}
                        </h4>
                        <p className={styles.chatProjectName}>
                          {chat.emprendimiento.nombre}
                        </p>
                        <span className={styles.chatType}>
                          {chat.tipoSolicitud === "financiamiento"
                            ? "Financiamiento"
                            : "Contacto"}
                        </span>
                      </div>
                      <div className={styles.chatMeta}>
                        <span className={styles.chatDate}>
                          {formatDate(chat.fechaUltimoMensaje)}
                        </span>
                        {chat.mensajesNoLeidos > 0 && (
                          <span className={styles.unreadBadge}>
                            {chat.mensajesNoLeidos}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.chatPreview}>
                      <p>{chat.ultimoMensaje}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.chatWindow}>
            {selectedChat ? (
              <div className={styles.chatWindowContent}>
                <div className={styles.chatWindowHeader}>
                  <div className={styles.chatWindowInfo}>
                    <h3>{selectedChat.emprendedor.nombre}</h3>
                    <p>Proyecto: {selectedChat.emprendimiento.nombre}</p>
                  </div>
                  <button
                    className={styles.closeChatBtn}
                    onClick={() => setSelectedChat(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.chatMessages}>
                  {isLoadingMessages && messages.length === 0 ? (
                    <div className={styles.chatPlaceholder}>
                      <p>Cargando mensajes...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className={styles.chatPlaceholder}>
                      <p>No hay mensajes aún</p>
                      <p>
                        Envía el primer mensaje para iniciar la conversación
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const token = localStorage.getItem("auth-token");
                      const decoded = token
                        ? JSON.parse(atob(token.split(".")[1]))
                        : null;
                      const isMyMessage =
                        decoded && msg.remitente_id === decoded.userId;

                      return (
                        <div
                          key={msg.id_mensaje}
                          className={`${styles.messageItem} ${
                            isMyMessage ? styles.myMessage : styles.otherMessage
                          }`}
                        >
                          <div className={styles.messageContent}>
                            {!isMyMessage && (
                              <span className={styles.messageSender}>
                                {msg.remitente_nombre}
                              </span>
                            )}
                            <p className={styles.messageText}>{msg.mensaje}</p>
                            <span className={styles.messageTime}>
                              {formatMessageTime(msg.fecha_envio)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form className={styles.chatInput} onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                  >
                    {isSending ? "Enviando..." : "Enviar"}
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.noChatSelected}>
                <h3>Selecciona un chat</h3>
                <p>
                  Elige una conversación de la lista para comenzar a chatear.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvestorChatsPage() {
  return (
    <ProtectedRoute requiredRole={2}>
      <ChatsPageContent />
    </ProtectedRoute>
  );
}
