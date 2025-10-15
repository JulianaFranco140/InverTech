import { NextResponse } from 'next/server';
import { Emprendimiento } from '../../../models/Emprendimiento.js';
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
    
    const requiredFields = ['nombre', 'descripcion', 'categoria', 'ingresos_mensuales', 'fecha_creacion', 'cantidad_empleados', 'cantidad_clientes'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const emprendimientoData = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      categoria: body.categoria,
      ingresos_mensuales: parseInt(body.ingresos_mensuales),
      emprendedor_id: decoded.userId,
      fecha_creacion: body.fecha_creacion,
      cantidad_empleados: parseInt(body.cantidad_empleados),
      cantidad_clientes: parseInt(body.cantidad_clientes)
    };

    const nuevoEmprendimiento = await Emprendimiento.create(emprendimientoData);
    
    return NextResponse.json({
      success: true,
      message: 'Emprendimiento creado exitosamente',
      emprendimiento: nuevoEmprendimiento
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating emprendimiento:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}