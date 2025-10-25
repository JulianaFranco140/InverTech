import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getTokenPayload } from '../../../../lib/tokenUtils';

const sql = neon(process.env.DATABASE_URL);

export async function DELETE(request, { params }) {
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

    if (!solicitudId || isNaN(parseInt(solicitudId))) {
      return NextResponse.json({ error: 'ID de solicitud inválido' }, { status: 400 });
    }

    const [solicitud] = await sql`
      SELECT id_solicitud, inversionista_id, estado, asunto
      FROM solicitudes_contacto 
      WHERE id_solicitud = ${solicitudId} AND inversionista_id = ${decoded.userId}
    `;

    if (!solicitud) {
      return NextResponse.json({ 
        error: 'Solicitud no encontrada o no tienes permisos para eliminarla' 
      }, { status: 404 });
    }

    if (solicitud.estado !== 'pendiente') {
      return NextResponse.json({ 
        error: `No puedes eliminar una solicitud en estado "${solicitud.estado}". Solo se pueden eliminar solicitudes pendientes.` 
      }, { status: 400 });
    }

    await sql`
      DELETE FROM solicitudes_contacto 
      WHERE id_solicitud = ${solicitudId} AND inversionista_id = ${decoded.userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Solicitud eliminada exitosamente',
      solicitudEliminada: {
        id: solicitud.id_solicitud,
        asunto: solicitud.asunto
      }
    });

  } catch (error) {
    console.error('❌ Error en DELETE /api/my-contact-requests/[id]:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}