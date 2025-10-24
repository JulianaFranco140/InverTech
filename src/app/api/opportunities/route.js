import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    console.log('🔍 GET /api/opportunities - Iniciando...');

    const oportunidades = await sql`
      SELECT 
        sf.id_solicitud,
        sf.monto_solicitado,
        sf.ganancia_anual,
        sf.tipo_financiamiento,
        sf.estado,
        sf.fecha_solicitud,
        sf.proposito,
        e.id_emprendimiento,
        e.nombre as emprendimiento_nombre,
        e.descripcion as emprendimiento_descripcion,
        e.categoria as emprendimiento_categoria,
        u.id_usuario as emprendedor_id,
        u.nombre as emprendedor_nombre
      FROM solicitudes_financiamiento sf
      INNER JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      WHERE sf.estado IN ('pendiente', 'aprobada', 'en_revision')
      ORDER BY sf.fecha_solicitud DESC
    `;

    console.log('📊 Oportunidades encontradas:', oportunidades.length);

    const oportunidadesProcesadas = oportunidades.map(oportunidad => {
      let roi = 'N/A';
      let riesgo = 'Medio';
      let riesgoColor = 'blue';

      try {
        if (oportunidad.ganancia_anual && oportunidad.monto_solicitado > 0) {
          const ganancia = parseFloat(oportunidad.ganancia_anual) || 0;
          const monto = parseFloat(oportunidad.monto_solicitado) || 0;
          
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
        roi = 'N/A';
      }

      const categoriaMap = {
        1: 'Tecnología',
        2: 'Salud',
        3: 'Fintech',
        4: 'E-commerce',
        5: 'Sostenibilidad',
        6: 'Educación',
        7: 'Agricultura',
        8: 'Logística',
        9: 'Energía',
        10: 'Alimentación'
      };

      const categoriaNombre = categoriaMap[oportunidad.emprendimiento_categoria] || 'General';

      return {
        id: oportunidad.id_solicitud,
        name: oportunidad.emprendimiento_nombre || 'Sin nombre',
        description: oportunidad.emprendimiento_descripcion || 'Sin descripción disponible',
        category: categoriaNombre,
        investment: parseFloat(oportunidad.monto_solicitado) || 0,
        roi: roi,
        risk: riesgo,
        riskColor: riesgoColor,
        emprendedor: oportunidad.emprendedor_nombre || 'Sin nombre',
        tipoFinanciamiento: oportunidad.tipo_financiamiento || 'No especificado',
        proposito: oportunidad.proposito || 'No especificado',
        estado: oportunidad.estado || 'pendiente',
        fechaSolicitud: oportunidad.fecha_solicitud,
        duration: 'Por definir',
        funded: 0,
        goal: 100,
        investors: 0,
        founded: new Date(oportunidad.fecha_solicitud).getFullYear().toString(),
        location: 'Colombia',
        tags: [categoriaNombre, oportunidad.tipo_financiamiento],
        image: '/placeholder-project.jpg'
      };
    });

    return NextResponse.json({
      success: true,
      opportunities: oportunidadesProcesadas,
      total: oportunidadesProcesadas.length,
      fuente: 'base_datos_real'
    });

  } catch (error) {
    console.error('❌ Error en /api/opportunities:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener oportunidades',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}