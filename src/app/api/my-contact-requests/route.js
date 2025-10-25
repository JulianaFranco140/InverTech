import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getTokenPayload } from '../../../lib/tokenUtils';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = getTokenPayload(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }
    const [inversionista] = await sql`
      SELECT id_usuario, nombre, rol_id 
      FROM usuarios 
      WHERE id_usuario = ${decoded.userId} AND rol_id = 2
    `;

    if (!inversionista) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado o no es inversionista' 
      }, { status: 403 });
    }

    const solicitudes = await sql`
      SELECT 
        sc.id_solicitud,
        sc.asunto,
        sc.mensaje,
        sc.monto_inversion,
        sc.especializaciones,
        sc.fecha_solicitud,
        sc.estado,
        e.id_emprendimiento,
        e.nombre as emprendimiento_nombre,
        e.descripcion as emprendimiento_descripcion,
        e.categoria,
        e.ingresos_mensuales,
        u.id_usuario as emprendedor_id,
        u.nombre as emprendedor_nombre,
        u.correo_electronico as emprendedor_email
      FROM solicitudes_contacto sc
      INNER JOIN emprendimientos e ON sc.emprendimiento_id = e.id_emprendimiento
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      WHERE sc.inversionista_id = ${decoded.userId}
      ORDER BY sc.fecha_solicitud DESC
    `;

    const categoriaMap = {
      1: 'Tecnología',
      2: 'Fintech', 
      3: 'E-commerce',
      4: 'Sostenibilidad',
      5: 'Salud',
      6: 'Educación',
      7: 'Agricultura',
      8: 'Alimentación',
      9: 'Servicios',
      10: 'Otro'
    };

    const estadoMap = {
      'pendiente': { label: 'Pendiente', color: 'warning' },
      'revision': { label: 'En Revisión', color: 'info' },
      'proceso': { label: 'En Proceso', color: 'primary' },
      'aceptada': { label: 'Aceptada', color: 'success' },
      'rechazada': { label: 'Rechazada', color: 'danger' },
      'completada': { label: 'Completada', color: 'success' }
    };

    const solicitudesProcesadas = solicitudes.map(solicitud => {
      const categoriaNombre = categoriaMap[solicitud.categoria] || 'General';
      const estadoInfo = estadoMap[solicitud.estado] || { label: solicitud.estado, color: 'secondary' };
      
      return {
        id: solicitud.id_solicitud,
        asunto: solicitud.asunto,
        mensaje: solicitud.mensaje,
        montoInversion: parseFloat(solicitud.monto_inversion) || 0,
        especializaciones: solicitud.especializaciones || [],
        fechaSolicitud: solicitud.fecha_solicitud,
        estado: solicitud.estado,
        estadoInfo: estadoInfo,
        emprendimiento: {
          id: solicitud.id_emprendimiento,
          nombre: solicitud.emprendimiento_nombre,
          descripcion: solicitud.emprendimiento_descripcion,
          categoria: categoriaNombre,
          categoriaId: solicitud.categoria,
          ingresosMensuales: parseFloat(solicitud.ingresos_mensuales) || 0
        },
        emprendedor: {
          id: solicitud.emprendedor_id,
          nombre: solicitud.emprendedor_nombre,
          email: solicitud.emprendedor_email
        },
        puedeEliminar: solicitud.estado === 'pendiente'
      };
    });

    return NextResponse.json({
      success: true,
      solicitudes: solicitudesProcesadas,
      total: solicitudesProcesadas.length,
      estadisticas: {
        pendientes: solicitudesProcesadas.filter(s => s.estado === 'pendiente').length,
        enRevision: solicitudesProcesadas.filter(s => s.estado === 'revision').length,
        enProceso: solicitudesProcesadas.filter(s => s.estado === 'proceso').length,
        aceptadas: solicitudesProcesadas.filter(s => s.estado === 'aceptada').length,
        rechazadas: solicitudesProcesadas.filter(s => s.estado === 'rechazada').length
      }
    });

  } catch (error) {
    console.error('❌ Error en /api/my-contact-requests:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}