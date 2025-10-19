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
      
      return result[0];
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


  static async checkActiveFundingRequests(id_emprendimiento) {
    try {
      const result = await sql`
        SELECT 
          id_solicitud,
          estado,
          monto_solicitado,
          tipo_financiamiento,
          fecha_solicitud
        FROM solicitudes_financiamiento 
        WHERE emprendimiento_id = ${id_emprendimiento}
          AND estado IN ('aprobada', 'en_revision')
        ORDER BY fecha_solicitud DESC
      `;
      
      return result;
    } catch (error) {
      console.error('Error checking active funding requests:', error);
      throw error;
    }
  }


  static async checkPendingFundingRequests(id_emprendimiento) {
    try {
      const result = await sql`
        SELECT 
          id_solicitud,
          estado,
          monto_solicitado,
          tipo_financiamiento,
          fecha_solicitud
        FROM solicitudes_financiamiento 
        WHERE emprendimiento_id = ${id_emprendimiento}
          AND estado = 'pendiente'
        ORDER BY fecha_solicitud DESC
      `;
      
      return result;
    } catch (error) {
      console.error('Error checking pending funding requests:', error);  
      throw error;
    }
  }



  static async delete(id) {
    try {
      // PASO 1: Verificar solicitudes activas (aprobadas o en revisión)
      const activeFunding = await this.checkActiveFundingRequests(id);
      
      if (activeFunding.length > 0) {
        const activeRequest = activeFunding[0];
        throw new Error(`No es posible eliminar el emprendimiento. Hay una solicitud de financiamiento ${activeRequest.estado === 'aprobada' ? 'APROBADA' : 'EN REVISIÓN'} por ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(activeRequest.monto_solicitado)}. Contacta al administrador para más información.`);
      }

      // PASO 2: Eliminar solicitudes pendientes si existen
      const pendingRequests = await this.checkPendingFundingRequests(id);
      
      if (pendingRequests.length > 0) {
        console.log(`Eliminando ${pendingRequests.length} solicitudes pendientes...`);
        
        // Obtener rutas de archivos para eliminar de Supabase
        const documentos = await sql`
          SELECT df.ruta_supabase 
          FROM documentos_financiamiento df
          INNER JOIN solicitudes_financiamiento sf ON df.solicitud_id = sf.id_solicitud
          WHERE sf.emprendimiento_id = ${id} AND sf.estado = 'pendiente'
        `;

          // Eliminar solicitudes pendientes (documentos se eliminan por CASCADE)
        await sql`
          DELETE FROM solicitudes_financiamiento 
          WHERE emprendimiento_id = ${id} AND estado = 'pendiente'
        `;

        // Retornar archivos para eliminar de Supabase si es necesario
        console.log(`Solicitudes pendientes eliminadas. Archivos a limpiar: ${documentos.length}`);
      }

      // PASO 3: Eliminar el emprendimiento
      const result = await sql`
        DELETE FROM emprendimientos 
        WHERE id_emprendimiento = ${id}
        RETURNING *
      `;
      
      return {
        emprendimiento: result[0],
        solicitudes_eliminadas: pendingRequests.length,
        archivos_limpiar: pendingRequests.length > 0 ? true : false
      };
    } catch (error) {
      console.error('Error deleting emprendimiento:', error);
      throw error;
    }
  }
}