import sql from '../lib/db.js';

export class SolicitudFinanciamiento {
  static async create(solicitudData, documentos = []) {
    try {
      const solicitud = await sql`
        INSERT INTO solicitudes_financiamiento (
          emprendedor_id,
          emprendimiento_id,
          monto_solicitado,
          ganancia_anual,
          tipo_financiamiento,
          proposito,
          cronograma
        )
        VALUES (
          ${solicitudData.emprendedor_id},
          ${solicitudData.emprendimiento_id},
          ${solicitudData.monto_solicitado},
          ${solicitudData.ganancia_anual},
          ${solicitudData.tipo_financiamiento},
          ${solicitudData.proposito},
          ${solicitudData.cronograma}
        )
        RETURNING *
      `;

      const solicitudId = solicitud[0].id_solicitud;

      // Guardar documentos si existen
      if (documentos.length > 0) {
        for (const doc of documentos) {
          await sql`
            INSERT INTO documentos_financiamiento (
              solicitud_id,
              nombre_archivo,
              tipo_archivo,
              tamano_archivo,
              url_supabase,
              ruta_supabase
            )
            VALUES (
              ${solicitudId},
              ${doc.nombre_archivo},
              ${doc.tipo_archivo},
              ${doc.tamano_archivo},
              ${doc.url_supabase},
              ${doc.ruta_supabase}
            )
          `;
        }
      }

      return { 
        solicitud: solicitud[0], 
        documentos: documentos 
      };
    } catch (error) {
      console.error('Error creating solicitud financiamiento:', error);
      throw error;
    }
  }

  static async findByEmprendedorId(emprendedor_id) {
    try {
      const result = await sql`
        SELECT 
          sf.*,
          e.nombre as emprendimiento_nombre,
          e.categoria as emprendimiento_categoria,
          COALESCE(
            json_agg(
              CASE 
                WHEN df.id_documento IS NOT NULL 
                THEN json_build_object(
                  'id_documento', df.id_documento,
                  'nombre_archivo', df.nombre_archivo,
                  'tipo_archivo', df.tipo_archivo,
                  'tamano_archivo', df.tamano_archivo,
                  'url_supabase', df.url_supabase,
                  'fecha_subida', df.fecha_subida
                )
                ELSE NULL 
              END
            ) FILTER (WHERE df.id_documento IS NOT NULL), 
            '[]'::json
          ) as documentos
        FROM solicitudes_financiamiento sf
        LEFT JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
        LEFT JOIN documentos_financiamiento df ON sf.id_solicitud = df.solicitud_id
        WHERE sf.emprendedor_id = ${emprendedor_id}
        GROUP BY sf.id_solicitud, e.nombre, e.categoria
        ORDER BY sf.fecha_solicitud DESC
      `;
      
      return result;
    } catch (error) {
      console.error('Error finding solicitudes:', error);
      throw error;
    }
  }

  static async findById(id_solicitud, emprendedor_id) {
    try {
      const result = await sql`
        SELECT 
          sf.*,
          e.nombre as emprendimiento_nombre,
          e.categoria as emprendimiento_categoria,
          COALESCE(
            json_agg(
              CASE 
                WHEN df.id_documento IS NOT NULL 
                THEN json_build_object(
                  'id_documento', df.id_documento,
                  'nombre_archivo', df.nombre_archivo,
                  'tipo_archivo', df.tipo_archivo,
                  'tamano_archivo', df.tamano_archivo,
                  'url_supabase', df.url_supabase,
                  'fecha_subida', df.fecha_subida
                )
                ELSE NULL 
              END
            ) FILTER (WHERE df.id_documento IS NOT NULL), 
            '[]'::json
          ) as documentos
        FROM solicitudes_financiamiento sf
        LEFT JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
        LEFT JOIN documentos_financiamiento df ON sf.id_solicitud = df.solicitud_id
        WHERE sf.id_solicitud = ${id_solicitud} 
          AND sf.emprendedor_id = ${emprendedor_id}
        GROUP BY sf.id_solicitud, e.nombre, e.categoria
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('Error finding solicitud:', error);
      throw error;
    }
  }

  static async updateEstado(id_solicitud, nuevo_estado) {
    try {
      const result = await sql`
        UPDATE solicitudes_financiamiento 
        SET 
          estado = ${nuevo_estado}
        WHERE id_solicitud = ${id_solicitud}
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('Error updating solicitud estado:', error);
      throw error;
    }
  }

  static async delete(id_solicitud, emprendedor_id) {
    try {
      const documentos = await sql`
        SELECT ruta_supabase 
        FROM documentos_financiamiento 
        WHERE solicitud_id = ${id_solicitud}
      `;

      const result = await sql`
        DELETE FROM solicitudes_financiamiento 
        WHERE id_solicitud = ${id_solicitud} 
          AND emprendedor_id = ${emprendedor_id}
        RETURNING *
      `;

      return {
        solicitud: result[0],
        archivos_eliminar: documentos.map(d => d.ruta_supabase)
      };
    } catch (error) {
      console.error('Error deleting solicitud:', error);
      throw error;
    }
  }
}