import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {

    const solicitudesRecientes = await sql`
      SELECT 
        sf.id_solicitud,
        sf.monto_solicitado,
        sf.ganancia_anual,
        sf.tipo_financiamiento,
        sf.estado,
        sf.fecha_solicitud,
        sf.proposito,
        sf.cronograma,
        e.id_emprendimiento,
        e.nombre as emprendimiento_nombre,
        e.descripcion as emprendimiento_descripcion,
        e.categoria as emprendimiento_categoria,
        u.id_usuario as emprendedor_id,
        u.nombre as emprendedor_nombre,
        u.correo_electronico as emprendedor_email
      FROM solicitudes_financiamiento sf
      INNER JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      WHERE sf.fecha_solicitud >= CURRENT_DATE - INTERVAL '30 days'
        AND sf.estado IN ('pendiente', 'aprobada', 'en_revision')
      ORDER BY sf.fecha_solicitud DESC
      LIMIT 20
    `;

    const todosEmprendimientos = await sql`
      SELECT 
        e.id_emprendimiento,
        e.nombre,
        e.fecha_creacion as fecha_fundacion,
        e.fecha_registro_plataforma,
        u.nombre as emprendedor_nombre
      FROM emprendimientos e
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      ORDER BY e.fecha_registro_plataforma DESC
    `;

    if (todosEmprendimientos.length > 0) {
      console.log('📊 Fechas de emprendimientos:', todosEmprendimientos.slice(0, 3).map(e => ({
        nombre: e.nombre,
        fechaFundacion: e.fecha_fundacion,
        fechaRegistroPlataforma: e.fecha_registro_plataforma
      })));
    }

    const emprendimientosRecientes = await sql`
      SELECT 
        e.id_emprendimiento,
        e.nombre,
        e.descripcion,
        e.categoria,
        e.emprendedor_id,
        e.fecha_creacion,
        e.fecha_registro_plataforma,
        e.cantidad_empleados,
        e.cantidad_clientes,
        u.nombre as emprendedor_nombre,
        u.correo_electronico as emprendedor_email
      FROM emprendimientos e
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      WHERE e.fecha_registro_plataforma >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY e.fecha_registro_plataforma DESC
      LIMIT 15
    `;

    let emprendimientosFinales = emprendimientosRecientes;
    if (emprendimientosRecientes.length === 0) {
      emprendimientosFinales = await sql`
        SELECT 
          e.id_emprendimiento,
          e.nombre,
          e.descripcion,
          e.categoria,
          e.emprendedor_id,
          e.fecha_creacion,
          e.fecha_registro_plataforma,
          e.cantidad_empleados,
          e.cantidad_clientes,
          u.nombre as emprendedor_nombre,
          u.correo_electronico as emprendedor_email
        FROM emprendimientos e
        INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
        WHERE e.fecha_registro_plataforma >= CURRENT_DATE - INTERVAL '90 days'
        ORDER BY e.fecha_registro_plataforma DESC
        LIMIT 10
      `;
    }

    if (emprendimientosFinales.length === 0 && todosEmprendimientos.length > 0) {
      emprendimientosFinales = await sql`
        SELECT 
          e.id_emprendimiento,
          e.nombre,
          e.descripcion,
          e.categoria,
          e.emprendedor_id,
          e.fecha_creacion,
          e.fecha_registro_plataforma,
          e.cantidad_empleados,
          e.cantidad_clientes,
          u.nombre as emprendedor_nombre,
          u.correo_electronico as emprendedor_email
        FROM emprendimientos e
        INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
        WHERE e.fecha_registro_plataforma IS NOT NULL
        ORDER BY e.fecha_registro_plataforma DESC
        LIMIT 10
      `;
    }


    const categoriaMap = {
      1: 'Tecnología',
      2: 'Fintech', 
      3: 'E-commerce',
      4: 'Sostenibilidad',
      5: 'Salud',
      6: 'Educación',
      7: 'Agricultura',
      8: 'Alimentación',
      9: 'Servicios',
      10: 'Otro'
    };

    const notificacionesSolicitudes = solicitudesRecientes.map(solicitud => {
      let roi = 'N/A';
      let riesgo = 'Medio';
      let riesgoColor = 'blue';

      try {
        if (solicitud.ganancia_anual && solicitud.monto_solicitado > 0) {
          const ganancia = parseFloat(solicitud.ganancia_anual) || 0;
          const monto = parseFloat(solicitud.monto_solicitado) || 0;
          
          if (monto > 0) {
            const roiNumerico = (ganancia / monto) * 100;
            roi = `${Math.round(roiNumerico)}%`;

            if (roiNumerico < 10) {
              riesgo = 'Bajo';
              riesgoColor = 'green';
            } else if (roiNumerico >= 10 && roiNumerico < 20) {
              riesgo = 'Medio';
              riesgoColor = 'blue';
            } else {
              riesgo = 'Alto';
              riesgoColor = 'orange';
            }
          }
        }
      } catch (error) {
        console.log('Error calculando ROI:', error);
      }

      return {
        id: `solicitud_${solicitud.id_solicitud}`,
        tipo: 'solicitud_financiamiento',
        titulo: 'Se ha registrado una nueva solicitud de financiamiento',
        emprendimiento: solicitud.emprendimiento_nombre || 'Sin nombre',
        descripcion: solicitud.emprendimiento_descripcion || 'Sin descripción disponible',
        categoria: categoriaMap[solicitud.emprendimiento_categoria] || 'General',
        emprendedor: solicitud.emprendedor_nombre || 'Sin nombre',
        emprendedorEmail: solicitud.emprendedor_email || '',
        monto: parseFloat(solicitud.monto_solicitado) || 0,
        gananciaAnual: parseFloat(solicitud.ganancia_anual) || 0,
        roi: roi,
        riesgo: riesgo,
        riesgoColor: riesgoColor,
        tipoFinanciamiento: solicitud.tipo_financiamiento || 'No especificado',
        estado: solicitud.estado || 'pendiente',
        fecha: solicitud.fecha_solicitud,
        proposito: solicitud.proposito || 'No especificado',
        cronograma: solicitud.cronograma || 'No especificado'
      };
    });

    const notificacionesEmprendimientos = emprendimientosFinales.map(emprendimiento => {
      console.log('🔧 Procesando emprendimiento:', emprendimiento.nombre, 
        'ID:', emprendimiento.id_emprendimiento, 
        'Fecha registro plataforma:', emprendimiento.fecha_registro_plataforma);
      
      return {
        id: `emprendimiento_${emprendimiento.id_emprendimiento}`,
        tipo: 'nuevo_emprendimiento',
        titulo: 'Se ha registrado un nuevo proyecto',
        emprendimiento: emprendimiento.nombre || 'Sin nombre',
        descripcion: emprendimiento.descripcion || 'Sin descripción disponible',
        categoria: categoriaMap[emprendimiento.categoria] || 'General',
        emprendedor: emprendimiento.emprendedor_nombre || 'Sin nombre',
        emprendedorEmail: emprendimiento.emprendedor_email || '',
        fecha: emprendimiento.fecha_registro_plataforma, 
        cantidadEmpleados: emprendimiento.cantidad_empleados || 0,
        cantidadClientes: emprendimiento.cantidad_clientes || 0,
        monto: 0,
        roi: 'N/A',
        riesgo: 'Nuevo',
        riesgoColor: 'gray'
      };
    });

    const todasLasNotificaciones = [
      ...notificacionesSolicitudes,
      ...notificacionesEmprendimientos
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    console.log('Total de notificaciones procesadas:', todasLasNotificaciones.length);
    console.log(' Breakdown detallado:', {
      solicitudes: notificacionesSolicitudes.length,
      emprendimientos: notificacionesEmprendimientos.length,
      tiposNotificaciones: todasLasNotificaciones.map(n => n.tipo)
    });

    if (todasLasNotificaciones.length > 0) {
      console.log('🔍 Primeras notificaciones por tipo:');
      const solicitudesDebug = todasLasNotificaciones.filter(n => n.tipo === 'solicitud_financiamiento').slice(0, 2);
      const emprendimientosDebug = todasLasNotificaciones.filter(n => n.tipo === 'nuevo_emprendimiento').slice(0, 2);
      
      console.log('  Solicitudes:', solicitudesDebug.map(n => n.emprendimiento));
      console.log('  Emprendimientos:', emprendimientosDebug.map(n => n.emprendimiento));
    }

    return NextResponse.json({
      success: true,
      solicitudes: todasLasNotificaciones,
      total: todasLasNotificaciones.length,
      fuente: 'base_datos_real',
      breakdown: {
        solicitudes: notificacionesSolicitudes.length,
        emprendimientos: notificacionesEmprendimientos.length
      },
      debug: {
        totalEmprendimientosEnBD: todosEmprendimientos.length,
        criterio: 'fecha_registro_plataforma'
      }
    });

  } catch (error) {
    
    return NextResponse.json(
      { 
        error: 'Error al obtener notificaciones',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}