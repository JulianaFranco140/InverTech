import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test imports básicos
    const { validateRegisterData } = await import('../../../lib/validations.js');
    const { User } = await import('../../../models/User.js');
    const { hashPassword } = await import('../../../lib/auth.js');
    
    return NextResponse.json({
      success: true,
      message: "Todos los imports funcionan correctamente",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}