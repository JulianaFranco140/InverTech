import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

 
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const users = await sql`
      SELECT id_usuario, correo_electronico, contrasena, nombre, rol_id 
      FROM usuarios 
      WHERE correo_electronico = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log(user);
    const isPasswordValid = await bcryptjs.compare(password, user.contrasena);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

 
    const token = jwt.sign(
      { 
        userId: user.id_usuario, 
        email: user.correo_electronico, 
        name: user.nombre,
        role: user.rol_id === 1 ? 1 : 2
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        email: user.correo_electronico,
        fullName: user.nombre,
        role: user.rol_id === 1 ? 'emprendedor' : 'inversionista'
      }
    });

 
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}