import { NextResponse } from 'next/server';

export async function POST() {
  try {

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