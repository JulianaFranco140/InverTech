'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InvestorSidebar from '../../../components/InvestorSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import styles from './page.module.css';

function ChatsPageContent() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setChats([
        {
          id: 1,
          emprendedor: {
            nombre: 'Juan Pérez',
            email: 'juan@techsolutions.co'
          },
          emprendimiento: {
            nombre: 'TechSolutions'
          },
          tipoSolicitud: 'contacto',
          ultimoMensaje: 'Gracias por tu interés en mi proyecto...',
          fechaUltimoMensaje: '2024-10-25T14:20:00',
          mensajesNoLeidos: 1,
          estado: 'activo'
        },
        {
          id: 2,
          emprendedor: {
            nombre: 'Ana Morales',
            email: 'ana@ecoapp.co'
          },
          emprendimiento: {
            nombre: 'EcoApp'
          },
          tipoSolicitud: 'financiamiento',
          ultimoMensaje: 'Me gustaría programar una reunión...',
          fechaUltimoMensaje: '2024-10-24T09:15:00',
          mensajesNoLeidos: 0,
          estado: 'activo'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                {chats.length} chat{chats.length !== 1 ? 's' : ''}
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
                <p>Cuando contactes a emprendedores, las conversaciones aparecerán aquí.</p>
                <Link href="/projects" className={styles.viewProjectsBtn}>
                  Explorar Proyectos
                </Link>
              </div>
            ) : (
              <div className={styles.chatItems}>
                {chats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`${styles.chatItem} ${selectedChat?.id === chat.id ? styles.chatItemActive : ''}`}
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
                          {chat.tipoSolicitud === 'financiamiento' ? 'Financiamiento' : 'Contacto'}
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
                  <div className={styles.chatPlaceholder}>
                    <p>Funcionalidad de chat en desarrollo...</p>
                    <p>Pronto podrás enviar y recibir mensajes en tiempo real.</p>
                  </div>
                </div>

                <div className={styles.chatInput}>
                  <input 
                    type="text" 
                    placeholder="Escribe un mensaje..." 
                    disabled
                  />
                  <button disabled>Enviar</button>
                </div>
              </div>
            ) : (
              <div className={styles.noChatSelected}>
                <h3>Selecciona un chat</h3>
                <p>Elige una conversación de la lista para comenzar a chatear.</p>
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