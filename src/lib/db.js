import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

const sql = neon(process.env.DATABASE_URL);

// Test de conexión
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Conexión a Neon DB exitosa:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Neon DB:', error);
    return false;
  }
}

export default sql;