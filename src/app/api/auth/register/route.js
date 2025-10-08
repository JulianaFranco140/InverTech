import { NextResponse } from 'next/server';
import { User } from '../../../../models/User.js';
import { hashPassword, generateToken } from '../../../../lib/auth.js';
import { validateRegisterData } from '../../../../lib/validations.js';

export async function POST(request) {
  try {
    const body = await request.json();
        
    const validation = validateRegisterData(body);
        
    if (!validation.isValid) {
      console.log('❌ Errores de validación:', validation.errors);
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(body.password);

    const newUser = await User.create({
      fullName: body.fullName.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      password: hashedPassword,
      role: body.role
    });

    const token = generateToken(
      newUser.id_usuario, 
      newUser.correo_electronico, 
      newUser.rol_id === 1 ? 'Inversionista' : 'Emprendedor'
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id_usuario,
          name: newUser.nombre,
          email: newUser.correo_electronico,
          phone: newUser.telefono,
          role: newUser.rol_id === 1 ? 'Inversionista' : 'Emprendedor'
        }
      },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (error) {
    console.error('💥 Registration error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}