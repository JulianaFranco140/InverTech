import { NextResponse } from 'next/server';
import { SolicitudFinanciamiento } from '../../../../models/SolicitudFinanciamiento.js';
import { deleteFile } from '../../../../lib/supabase.js';
import jwt from 'jsonwebtoken';

function verifyToken(request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  if (!token) {
    throw new Error('Token no encontrado en Authorization header');
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

    // Eliminar archivos de Supabase
    for (const rutaArchivo of result.archivos_eliminar) {
      try {
        await deleteFile('documentos', rutaArchivo);
      } catch (fileError) {
        console.error('Error deleting file from Supabase:', fileError);
      }
    }
    
    console.log(`✅ Solicitud ${id} eliminada exitosamente`);
    
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