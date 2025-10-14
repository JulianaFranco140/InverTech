import sql from '../lib/db.js';

export class Emprendimiento {
  static async create(emprendimientoData) {
    try {
      const result = await sql`
        INSERT INTO emprendimientos (
          nombre, 
          descripcion, 
          categoria, 
          ingresos_mensuales, 
          emprendedor_id, 
          fecha_creacion, 
          cantidad_empleados, 
          cantidad_clientes
        )
        VALUES (
          ${emprendimientoData.nombre},
          ${emprendimientoData.descripcion},
          ${emprendimientoData.categoria},
          ${emprendimientoData.ingresos_mensuales},
          ${emprendimientoData.emprendedor_id},
          ${emprendimientoData.fecha_creacion},
          ${emprendimientoData.cantidad_empleados},
          ${emprendimientoData.cantidad_clientes}
        )
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('Error creating emprendimiento:', error);
      throw error;
    }
  }

  static async findByEmprendedorId(emprendedor_id) {
    try {
      const result = await sql`
        SELECT * FROM emprendimientos 
        WHERE emprendedor_id = ${emprendedor_id}
        ORDER BY fecha_creacion DESC
      `;
      
      return result;
    } catch (error) {
      console.error('Error finding emprendimientos:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql`
        SELECT * FROM emprendimientos 
        WHERE id_emprendimiento = ${id}
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('Error finding emprendimiento by id:', error);
      throw error;
    }
  }

  static async update(id, emprendimientoData) {
    try {
      const result = await sql`
        UPDATE emprendimientos 
        SET 
          nombre = ${emprendimientoData.nombre},
          descripcion = ${emprendimientoData.descripcion},
          categoria = ${emprendimientoData.categoria},
          ingresos_mensuales = ${emprendimientoData.ingresos_mensuales},
          cantidad_empleados = ${emprendimientoData.cantidad_empleados},
          cantidad_clientes = ${emprendimientoData.cantidad_clientes}
        WHERE id_emprendimiento = ${id}
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('Error updating emprendimiento:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await sql`
        DELETE FROM emprendimientos 
        WHERE id_emprendimiento = ${id}
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('Error deleting emprendimiento:', error);
      throw error;
    }
  }
}