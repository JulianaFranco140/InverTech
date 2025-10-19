import { NextResponse } from 'next/server';
import { Emprendimiento } from '../../../../models/Emprendimiento.js';
import { deleteFile } from '../../../../lib/supabase.js';
import jwt from 'jsonwebtoken';

function verifyToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    throw new Error('Token no encontrado');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
}

export async function DELETE(request, { params }) {
  try {
    const decoded = verifyToken(request);
    const { id } = params;
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    // Verificar que el emprendimiento existe y pertenece al usuario
    const emprendimiento = await Emprendimiento.findById(id);
    
    if (!emprendimiento) {
      return NextResponse.json(
        { error: 'Emprendimiento no encontrado' },
        { status: 404 }
      );
    }

    if (emprendimiento.emprendedor_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este emprendimiento' },
        { status: 403 }
      );
    }

    // Intentar eliminar (la lógica de verificación está en el modelo)
    const result = await Emprendimiento.delete(id);
    
    // Si llegamos aquí, la eliminación fue exitosa
    let message = 'Emprendimiento eliminado exitosamente';
    
    if (result.solicitudes_eliminadas > 0) {
      message += `. También se eliminaron ${result.solicitudes_eliminadas} solicitudes de financiamiento pendientes.`;
    }

    // TODO: Limpiar archivos de Supabase si es necesario
    // Esta funcionalidad se puede implementar más adelante si se necesita

    return NextResponse.json({
      success: true,
      message: message,
      details: {
        emprendimiento_eliminado: result.emprendimiento.nombre,
        solicitudes_eliminadas: result.solicitudes_eliminadas
      }
    });

  } catch (error) {
    console.error('Error deleting emprendimiento:', error);
    
    // Verificar si es un error de solicitudes activas
    if (error.message.includes('solicitud de financiamiento')) {
      return NextResponse.json(
        { 
          error: error.message,
          type: 'ACTIVE_FUNDING_ERROR'
        },
        { status: 409 } // Conflict
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}