import { NextResponse } from 'next/server';
import { SolicitudFinanciamiento } from '../../../../models/SolicitudFinanciamiento.js';
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

export async function GET(request, { params }) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    const { id } = params;
    const solicitud = await SolicitudFinanciamiento.findById(parseInt(id), decoded.userId);
    
    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      solicitud
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    const { id } = params;
    const result = await SolicitudFinanciamiento.delete(parseInt(id), decoded.userId);
    
    if (!result.solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    for (const rutaArchivo of result.archivos_eliminar) {
      try {
        await deleteFile('documentos', rutaArchivo);
      } catch (fileError) {
        console.error('Error deleting file from Supabase:', fileError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Solicitud eliminada exitosamente'
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}