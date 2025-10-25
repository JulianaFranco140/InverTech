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

    const [emprendedor] = await sql`
      SELECT id_usuario, nombre, rol_id 
      FROM usuarios 
      WHERE id_usuario = ${decoded.userId} AND rol_id = 1
    `;

    if (!emprendedor) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado o no es emprendedor' 
      }, { status: 403 });
    }

    const emprendimientos = await sql`
      SELECT id_emprendimiento
      FROM emprendimientos 
      WHERE emprendedor_id = ${decoded.userId}
    `;

    if (emprendimientos.length === 0) {
      return NextResponse.json({
        success: true,
        solicitudes: [],
        total: 0,
        estadisticas: {
          pendientes: 0,
          revision: 0,
          proceso: 0,
          aceptadas: 0,
          rechazadas: 0
        }
      });
    }

    const emprendimientoIds = emprendimientos.map(e => e.id_emprendimiento);

    const solicitudes = await sql`
      SELECT 
        sc.id_solicitud,
        sc.asunto,
        sc.mensaje,
        sc.monto_inversion,
        sc.especializaciones,
        sc.fecha_solicitud,
        sc.estado,
        sc.emprendimiento_id,
        e.nombre as emprendimiento_nombre,
        e.descripcion as emprendimiento_descripcion,
        e.categoria,
        u.id_usuario as inversionista_id,
        u.nombre as inversionista_nombre,
        u.correo_electronico as inversionista_email,
        u.telefono as inversionista_telefono
      FROM solicitudes_contacto sc
      INNER JOIN emprendimientos e ON sc.emprendimiento_id = e.id_emprendimiento
      INNER JOIN usuarios u ON sc.inversionista_id = u.id_usuario
      WHERE sc.emprendimiento_id = ANY(${emprendimientoIds})
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
      'rechazada': { label: 'Rechazada', color: 'danger' }
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
          id: solicitud.emprendimiento_id,
          nombre: solicitud.emprendimiento_nombre,
          descripcion: solicitud.emprendimiento_descripcion,
          categoria: categoriaNombre,
          categoriaId: solicitud.categoria
        },
        inversionista: {
          id: solicitud.inversionista_id,
          nombre: solicitud.inversionista_nombre,
          email: solicitud.inversionista_email,
          telefono: solicitud.inversionista_telefono || null
        },
        puedeResponder: solicitud.estado === 'pendiente',
        puedeModificar: ['pendiente', 'revision'].includes(solicitud.estado)
      };
    });

    const estadisticas = {
      pendientes: solicitudesProcesadas.filter(s => s.estado === 'pendiente').length,
      revision: solicitudesProcesadas.filter(s => s.estado === 'revision').length,
      proceso: solicitudesProcesadas.filter(s => s.estado === 'proceso').length,
      aceptadas: solicitudesProcesadas.filter(s => s.estado === 'aceptada').length,
      rechazadas: solicitudesProcesadas.filter(s => s.estado === 'rechazada').length
    };

    return NextResponse.json({
      success: true,
      solicitudes: solicitudesProcesadas,
      total: solicitudesProcesadas.length,
      estadisticas: estadisticas
    });

  } catch (error) {
    console.error('Error en /api/investor-requests:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}