import { NextResponse } from 'next/server';
import { Emprendimiento } from '../../../../models/Emprendimiento.js';
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

    await Emprendimiento.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting emprendimiento:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}