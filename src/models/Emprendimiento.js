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
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql`
        SELECT * FROM emprendimientos 
        WHERE id_emprendimiento = ${id}
      `;
      
      return result[0];
    } catch (error) {
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
      throw error;
    }
  }

  static async delete(id) {
    try {
      
      const solicitudesQueBloquean = await sql`
        SELECT 
          id_solicitud,
          estado,
          monto_solicitado,
          tipo_financiamiento,
          fecha_solicitud
        FROM solicitudes_financiamiento 
        WHERE emprendimiento_id = ${id}
          AND estado IN ('aprobada', 'en_revision', 'en_proceso')
        ORDER BY fecha_solicitud DESC
      `;
      
      
      if (solicitudesQueBloquean.length > 0) {
        const solicitudActiva = solicitudesQueBloquean[0];
        const estadoTexto = {
          'aprobada': 'APROBADA',
          'en_revision': 'EN REVISIÓN', 
          'en_proceso': 'EN PROCESO'
        }[solicitudActiva.estado] || solicitudActiva.estado.toUpperCase();
        
        const monto = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(solicitudActiva.monto_solicitado);
        
        throw new Error(`Este proyecto tiene solicitudes de financiamiento en proceso activo (${estadoTexto}), no es posible eliminarlo. Contacta al administrador para más información.`);
      }
      
      const solicitudesEliminables = await sql`
        SELECT 
          id_solicitud,
          estado,
          monto_solicitado
        FROM solicitudes_financiamiento 
        WHERE emprendimiento_id = ${id}
          AND estado IN ('pendiente', 'rechazada')
        ORDER BY fecha_solicitud DESC
      `;
      
      
      if (solicitudesEliminables.length > 0) {
        
        await sql`
          DELETE FROM documentos_financiamiento 
          WHERE solicitud_id IN (
            SELECT id_solicitud 
            FROM solicitudes_financiamiento 
            WHERE emprendimiento_id = ${id}
              AND estado IN ('pendiente', 'rechazada')
          )
        `;
        
        await sql`
          DELETE FROM solicitudes_financiamiento 
          WHERE emprendimiento_id = ${id}
            AND estado IN ('pendiente', 'rechazada')
        `;
        
      }

      const verificacionFinal = await sql`
        SELECT COUNT(*) as total 
        FROM solicitudes_financiamiento 
        WHERE emprendimiento_id = ${id}
      `;
      
      if (parseInt(verificacionFinal[0].total) > 0) {
        const solicitudesRestantes = await sql`
          SELECT estado, COUNT(*) as cantidad 
          FROM solicitudes_financiamiento 
          WHERE emprendimiento_id = ${id}
          GROUP BY estado
        `;
        
        throw new Error('Este proyecto tiene solicitudes de financiamiento en proceso activo, no es posible eliminarlo.');
      }

      const result = await sql`
        DELETE FROM emprendimientos 
        WHERE id_emprendimiento = ${id}
        RETURNING *
      `;
      
      if (result.length === 0) {
        throw new Error('No se encontró el emprendimiento para eliminar');
      }
            
      return {
        emprendimiento: result[0],
        solicitudes_eliminadas: solicitudesEliminables.length,
        archivos_limpiar: solicitudesEliminables.length > 0
      };
      
    } catch (error) {
      
      if (error.message.includes('foreign key') || 
          error.message.includes('constraint') ||
          error.message.includes('violates')) {
        throw new Error('Este proyecto tiene solicitudes de financiamiento en proceso activo, no es posible eliminarlo.');
      }
      
      if (error.message.includes('proceso activo') || 
          error.message.includes('ELIMINACIÓN BLOQUEADA')) {
        throw error;
      }
      
      throw new Error(`Error al eliminar el proyecto: ${error.message}`);
    }
  }
}