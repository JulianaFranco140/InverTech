import { NextResponse } from 'next/server';
import { SolicitudFinanciamiento } from '../../../models/SolicitudFinanciamiento.js';
import { uploadFile, getPublicUrl } from '../../../lib/supabase.js';
import jwt from 'jsonwebtoken';

function verifyToken(request) {

  const authHeader = request.headers.get('Authorization');

  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  if (!token) {
    throw new Error('Token no encontrado en Authorization header');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
}
export async function POST(request) {
  try {
    
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Solo los emprendedores pueden solicitar financiamiento' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    const solicitudData = {
      emprendedor_id: decoded.userId,
      emprendimiento_id: parseInt(formData.get('emprendimiento_id')),
      monto_solicitado: parseFloat(formData.get('amount')),
      ganancia_anual: formData.get('revenue') ? parseFloat(formData.get('revenue')) : null,
      tipo_financiamiento: formData.get('type'),
      proposito: formData.get('purpose'),
      cronograma: formData.get('timeline')
    };


    if (!solicitudData.emprendimiento_id || !solicitudData.monto_solicitado || 
        !solicitudData.tipo_financiamiento || !solicitudData.proposito || 
        !solicitudData.cronograma) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const { default: sql } = await import('../../../lib/db.js');
    const emprendimiento = await sql`
      SELECT id_emprendimiento, nombre 
      FROM emprendimientos 
      WHERE id_emprendimiento = ${solicitudData.emprendimiento_id} 
        AND emprendedor_id = ${decoded.userId}
    `;

    if (emprendimiento.length === 0) {
      return NextResponse.json(
        { error: 'El emprendimiento no existe o no te pertenece' },
        { status: 404 }
      );
    }

    const documentos = [];
    const files = formData.getAll('documents');
    
    for (const file of files) {
      if (file.size > 0) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const fileName = `${timestamp}_${randomId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `financiamiento/${decoded.userId}/${solicitudData.emprendimiento_id}/${fileName}`;
        
        try {
          await uploadFile(file, 'documentos', filePath);
          
          const publicUrl = getPublicUrl('documentos', filePath);
          
          documentos.push({
            nombre_archivo: file.name,
            tipo_archivo: file.type,
            tamano_archivo: file.size,
            url_supabase: publicUrl,
            ruta_supabase: filePath
          });
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          return NextResponse.json(
            { error: `Error subiendo archivo ${file.name}: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }
    }

    const result = await SolicitudFinanciamiento.create(solicitudData, documentos);
    
    
    return NextResponse.json({
      success: true,
      message: 'Solicitud de financiamiento creada exitosamente',
      data: result
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    
    const decoded = verifyToken(request);
    
    if (decoded.role !== 1) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    
    const solicitudes = await SolicitudFinanciamiento.findByEmprendedorId(decoded.userId);
    
    
    return NextResponse.json({
      success: true,
      solicitudes: solicitudes || []
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}