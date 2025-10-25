import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {

    const proyectos = await sql`
      SELECT 
        e.id_emprendimiento,
        e.nombre,
        e.descripcion,
        e.categoria,
        e.ingresos_mensuales,
        e.fecha_creacion,
        e.cantidad_empleados,
        e.cantidad_clientes,
        e.fecha_registro_plataforma,
        u.id_usuario as emprendedor_id,
        u.nombre as emprendedor_nombre,
        u.correo_electronico as emprendedor_email,
        u.telefono as emprendedor_telefono
      FROM emprendimientos e
      INNER JOIN usuarios u ON e.emprendedor_id = u.id_usuario
      WHERE e.fecha_registro_plataforma IS NOT NULL
      ORDER BY e.fecha_registro_plataforma DESC
    `;


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

    const proyectosProcesados = proyectos.map(proyecto => {
      const categoriaNombre = categoriaMap[proyecto.categoria] || 'General';
      
      const fechaCreacion = new Date(proyecto.fecha_creacion);
      const ahora = new Date();
      const yearsInMarket = Math.floor((ahora - fechaCreacion) / (1000 * 60 * 60 * 24 * 365));
      const monthsInMarket = Math.floor((ahora - fechaCreacion) / (1000 * 60 * 60 * 24 * 30));
      
      let timeInMarket = '';
      if (yearsInMarket > 0) {
        timeInMarket = `${yearsInMarket} año${yearsInMarket > 1 ? 's' : ''}`;
      } else if (monthsInMarket > 0) {
        timeInMarket = `${monthsInMarket} mes${monthsInMarket > 1 ? 'es' : ''}`;
      } else {
        timeInMarket = 'Recién iniciado';
      }

      const ingresosAnuales = (parseFloat(proyecto.ingresos_mensuales) || 0) * 12;

      return {
        id: proyecto.id_emprendimiento,
        name: proyecto.nombre || 'Sin nombre',
        description: proyecto.descripcion || 'Sin descripción disponible',
        category: categoriaNombre,
        categoryId: proyecto.categoria,
        monthlyRevenue: parseFloat(proyecto.ingresos_mensuales) || 0,
        annualRevenue: ingresosAnuales,
        employees: proyecto.cantidad_empleados || 0,
        clients: proyecto.cantidad_clientes || 0,
        founded: fechaCreacion.getFullYear().toString(),
        timeInMarket: timeInMarket,
        registrationDate: proyecto.fecha_registro_plataforma,
        foundationDate: proyecto.fecha_creacion,
        entrepreneur: {
          id: proyecto.emprendedor_id,
          name: proyecto.emprendedor_nombre || 'Sin nombre',
          email: proyecto.emprendedor_email || '',
          phone: proyecto.emprendedor_telefono || ''
        },
        location: 'Colombia',
        tags: [categoriaNombre, timeInMarket],
        image: '/placeholder-project.jpg'
      };
    });

    return NextResponse.json({
      success: true,
      projects: proyectosProcesados,
      total: proyectosProcesados.length,
      categories: Object.values(categoriaMap)
    });

  } catch (error) {
    
    return NextResponse.json(
      { 
        error: 'Error al obtener proyectos',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      },
      { status: 500 }
    );
  }
}