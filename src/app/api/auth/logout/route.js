import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Con localStorage, el logout se maneja completamente en el cliente
    // No necesitamos limpiar cookies del servidor
    const response = NextResponse.json({
      message: 'Logout exitoso'
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en logout' },
      { status: 500 }
    );
  }
}