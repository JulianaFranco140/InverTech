import { NextResponse } from 'next/server';
import { Emprendimiento } from '../../../../models/Emprendimiento.js';
import { deleteFile } from '../../../../lib/supabase.js';
import jwt from 'jsonwebtoken';

function verifyToken(request) {
  // Buscar token en Authorization header
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
    const result = await Emprendimiento.delete(parseInt(id), decoded.userId);
    
    if (!result.emprendimiento) {
      return NextResponse.json(
        { error: 'Emprendimiento no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar archivos relacionados de Supabase
    for (const rutaArchivo of result.archivos_eliminar || []) {
      try {
        await deleteFile('documentos', rutaArchivo);
      } catch (fileError) {
        console.error('Error deleting file from Supabase:', fileError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente'
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}