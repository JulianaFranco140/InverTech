import { NextResponse } from 'next/server';
import { Emprendimiento } from '../../../models/Emprendimiento.js';
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

export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    const emprendimientos = await Emprendimiento.findByEmprendedorId(decoded.userId);
    
    return NextResponse.json({
      success: true,
      emprendimientos
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const emprendimientoData = {
      ...body,
      emprendedor_id: decoded.userId
    };
    
    const result = await Emprendimiento.create(emprendimientoData);
    
    return NextResponse.json({
      success: true,
      emprendimiento: result
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}