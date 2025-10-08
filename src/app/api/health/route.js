import { NextResponse } from 'next/server';
import sql from '../../../lib/db.js';

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as current_time, 1 as connected`;
    
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: result[0].current_time
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    }, { status: 500 });
  }
}