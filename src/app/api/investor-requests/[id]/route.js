import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getTokenPayload } from '../../../../lib/tokenUtils';

const sql = neon(process.env.DATABASE_URL);

export async function PATCH(request, { params }) {
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

    const solicitudId = params.id;
    const body = await request.json();
    const { estado } = body;

    if (!solicitudId || isNaN(parseInt(solicitudId))) {
      return NextResponse.json({ error: 'ID de solicitud inválido' }, { status: 400 });
    }

    const estadosValidos = ['pendiente', 'revision', 'proceso', 'aceptada', 'rechazada'];
    if (!estado || !estadosValidos.includes(estado)) {
      return NextResponse.json({ 
        error: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` 
      }, { status: 400 });
    }

    const [solicitud] = await sql`
      SELECT 
        sc.id_solicitud,
        sc.estado as estado_actual,
        sc.asunto,
        e.emprendedor_id,
        e.nombre as emprendimiento_nombre
      FROM solicitudes_contacto sc
      INNER JOIN emprendimientos e ON sc.emprendimiento_id = e.id_emprendimiento
      WHERE sc.id_solicitud = ${solicitudId} AND e.emprendedor_id = ${decoded.userId}
    `;

    if (!solicitud) {
      return NextResponse.json({ 
        error: 'Solicitud no encontrada o no tienes permisos para modificarla' 
      }, { status: 404 });
    }

    const [solicitudActualizada] = await sql`
      UPDATE solicitudes_contacto 
      SET estado = ${estado}
      WHERE id_solicitud = ${solicitudId}
      RETURNING id_solicitud, estado, fecha_solicitud
    `;

    return NextResponse.json({
      success: true,
      message: `Estado actualizado a "${estado}" exitosamente`,
      solicitud: {
        id: solicitudActualizada.id_solicitud,
        estadoAnterior: solicitud.estado_actual,
        estadoNuevo: solicitudActualizada.estado,
        asunto: solicitud.asunto,
        emprendimiento: solicitud.emprendimiento_nombre
      }
    });

  } catch (error) {
    console.error('Error en PATCH /api/investor-requests/[id]:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}