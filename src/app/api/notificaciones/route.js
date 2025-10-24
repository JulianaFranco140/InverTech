import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🔍 GET /api/notificaciones - Iniciando...');
    
    console.log('✅ Generando solicitudes genéricas...');

    // Datos genéricos de solicitudes con riesgo calculado
    const solicitudesGenericas = [
      {
        id: 1,
        emprendimiento: 'EcoTech Solutions',
        descripcion: 'Startup de tecnología verde enfocada en el reciclaje inteligente de residuos urbanos mediante IoT y AI',
        categoria: 'Tecnología Verde',
        emprendedor: 'María González',
        monto: 500000000,
        roi: '18%',
        riesgo: 'Medio',
        riesgoColor: 'blue',
        fecha: '2024-10-15T10:30:00Z',
        proposito: 'Expansión a 5 nuevas ciudades y desarrollo de nueva línea de productos sostenibles'
      },
      {
        id: 2,
        emprendimiento: 'FinanceAI Pro',
        descripcion: 'Plataforma de inteligencia artificial para gestión financiera personal y empresarial',
        categoria: 'Fintech',
        emprendedor: 'Carlos Rodríguez',
        monto: 800000000,
        roi: '25%',
        riesgo: 'Alto',
        riesgoColor: 'orange',
        fecha: '2024-10-12T14:15:00Z',
        proposito: 'Desarrollo de nuevos algoritmos de AI y contratación de equipo técnico especializado'
      },
      {
        id: 3,
        emprendimiento: 'HealthTech Innovations',
        descripcion: 'Aplicación móvil para telemedicina y monitoreo remoto de pacientes crónicos',
        categoria: 'Salud Digital',
        emprendedor: 'Ana López',
        monto: 300000000,
        roi: '12%',
        riesgo: 'Medio',
        riesgoColor: 'blue',
        fecha: '2024-10-10T09:45:00Z',
        proposito: 'Certificaciones médicas internacionales y alianzas con hospitales principales'
      },
      {
        id: 4,
        emprendimiento: 'AgriSmart Colombia',
        descripcion: 'Sistema de agricultura inteligente con sensores IoT para optimización de cultivos',
        categoria: 'AgriTech',
        emprendedor: 'Pedro Martínez',
        monto: 650000000,
        roi: '22%',
        riesgo: 'Alto',
        riesgoColor: 'orange',
        fecha: '2024-10-08T16:20:00Z',
        proposito: 'Investigación y desarrollo de nuevos sensores, expansión a mercados rurales'
      },
      {
        id: 5,
        emprendimiento: 'EduPlatform Virtual',
        descripcion: 'Plataforma educativa online con realidad virtual para enseñanza inmersiva',
        categoria: 'EdTech',
        emprendedor: 'Laura Sánchez',
        monto: 450000000,
        roi: '15%',
        riesgo: 'Medio',
        riesgoColor: 'blue',
        fecha: '2024-10-05T11:30:00Z',
        proposito: 'Desarrollo de contenido en VR y partnerships con instituciones educativas'
      },
      {
        id: 6,
        emprendimiento: 'LogisticsPro AI',
        descripcion: 'Optimización de rutas de entrega mediante inteligencia artificial y machine learning',
        categoria: 'Logística',
        emprendedor: 'Roberto Silva',
        monto: 700000000,
        roi: '20%',
        riesgo: 'Alto',
        riesgoColor: 'orange',
        fecha: '2024-10-03T13:10:00Z',
        proposito: 'Escalamiento de la plataforma y expansión a mercados internacionales'
      },
      {
        id: 7,
        emprendimiento: 'CleanEnergy Solutions',
        descripcion: 'Paneles solares inteligentes con sistema de almacenamiento energético avanzado',
        categoria: 'Energía Renovable',
        emprendedor: 'Diana Castro',
        monto: 900000000,
        roi: '28%',
        riesgo: 'Alto',
        riesgoColor: 'orange',
        fecha: '2024-10-01T08:00:00Z',
        proposito: 'Construcción de planta de manufactura y certificaciones internacionales'
      },
      {
        id: 8,
        emprendimiento: 'FoodTech Delivery',
        descripcion: 'Plataforma de delivery con cocinas virtuales y optimización de tiempos de entrega',
        categoria: 'FoodTech',
        emprendedor: 'Miguel Torres',
        monto: 400000000,
        roi: '16%',
        riesgo: 'Medio',
        riesgoColor: 'blue',
        fecha: '2024-09-28T17:45:00Z',
        proposito: 'Apertura de 10 nuevas cocinas virtuales y desarrollo de app móvil avanzada'
      },
      {
        id: 9,
        emprendimiento: 'CryptoSecure Wallet',
        descripcion: 'Billetera digital con seguridad blockchain para transacciones financieras',
        categoria: 'Blockchain',
        emprendedor: 'Andrés Morales',
        monto: 550000000,
        roi: '8%',
        riesgo: 'Bajo',
        riesgoColor: 'green',
        fecha: '2024-09-25T12:20:00Z',
        proposito: 'Desarrollo de protocolos de seguridad avanzados y alianzas bancarias'
      },
      {
        id: 10,
        emprendimiento: 'SmartHome IoT',
        descripcion: 'Sistema integral de automatización del hogar con inteligencia artificial',
        categoria: 'IoT',
        emprendedor: 'Sofía Herrera',
        monto: 380000000,
        roi: '9%',
        riesgo: 'Bajo',
        riesgoColor: 'green',
        fecha: '2024-09-22T15:35:00Z',
        proposito: 'Certificaciones de seguridad y desarrollo de app móvil multiplataforma'
      }
    ];

    console.log('✅ Solicitudes genéricas generadas:', solicitudesGenericas.length);

    return NextResponse.json({
      success: true,
      solicitudes: solicitudesGenericas,
      total: solicitudesGenericas.length
    });

  } catch (error) {
    console.error('❌ Error en /api/notificaciones:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}