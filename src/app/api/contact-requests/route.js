import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getTokenPayload } from '../../../lib/tokenUtils';

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
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

    const body = await request.json();
    const { 
      emprendimientoId, 
      asunto, 
      mensaje, 
      montoInversion, 
      especializaciones 
    } = body;

    if (!emprendimientoId || !asunto || !mensaje || !especializaciones || especializaciones.length === 0) {
      return NextResponse.json({ 
        error: 'Datos incompletos' 
      }, { status: 400 });
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

    const [emprendimiento] = await sql`
      SELECT id_emprendimiento, nombre, emprendedor_id
      FROM emprendimientos 
      WHERE id_emprendimiento = ${emprendimientoId}
    `;

    if (!emprendimiento) {
      return NextResponse.json({ 
        error: 'Emprendimiento no encontrado' 
      }, { status: 404 });
    }

    if (emprendimiento.emprendedor_id === decoded.userId) {
      return NextResponse.json({ 
        error: 'No puedes contactar tu propio emprendimiento' 
      }, { status: 400 });
    }

    const [solicitudCreada] = await sql`
      INSERT INTO solicitudes_contacto (
        inversionista_id,
        emprendimiento_id,
        asunto,
        mensaje,
        monto_inversion,
        especializaciones,
        estado
      ) VALUES (
        ${decoded.userId},
        ${emprendimientoId},
        ${asunto},
        ${mensaje},
        ${montoInversion},
        ${especializaciones},
        'pendiente'
      )
      RETURNING id_solicitud, fecha_solicitud, monto_inversion
    `;

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada exitosamente',
      solicitud: {
        id: solicitudCreada.id_solicitud,
        fecha: solicitudCreada.fecha_solicitud,
        monto: solicitudCreada.monto_inversion
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}