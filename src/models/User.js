import sql from '../lib/db.js';

export class User {
  static async create(userData) {
    const { fullName, email, phone, password, role } = userData;
    
    const rolId = role === 'Inversionista' ? 1 : 2;
    
    try {
      console.log('🔍 Creando usuario con datos:', { fullName, email, phone, role, rolId });
      
      const result = await sql`
        INSERT INTO usuarios (nombre, correo_electronico, telefono, contrasena, rol_id)
        VALUES (${fullName}, ${email}, ${phone}, ${password}, ${rolId})
        RETURNING id_usuario, nombre, correo_electronico, telefono, rol_id
      `;
      
      console.log('✅ Usuario creado en DB:', result[0]);
      return result[0];
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await sql`
        SELECT * FROM usuarios WHERE correo_electronico = ${email}
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('❌ Error buscando usuario:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql`
        SELECT id_usuario, nombre, correo_electronico, telefono, rol_id 
        FROM usuarios WHERE id_usuario = ${id}
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('❌ Error buscando usuario por ID:', error);
      throw error;
    }
  }
}