import { NextResponse } from "next/server";
import sql from "../../../../lib/db";
import { verifyToken } from "../../../../lib/auth";

export async function POST(request) {
  try {
    // Verificar autenticación
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const emprendedorId = decoded.userId;
    const body = await request.json();
    const { inversionistaId, solicitudId, tipoSolicitud, emprendimientoId } =
      body;

    console.log("Datos recibidos:", {
      emprendedorId,
      inversionistaId,
      solicitudId,
      tipoSolicitud,
      emprendimientoId,
    });

    // Validar datos requeridos
    if (
      !inversionistaId ||
      !solicitudId ||
      !tipoSolicitud ||
      !emprendimientoId
    ) {
      return NextResponse.json(
        {
          error: "Faltan datos requeridos",
          received: {
            inversionistaId,
            solicitudId,
            tipoSolicitud,
            emprendimientoId,
          },
        },
        { status: 400 }
      );
    }

    // Validar que el emprendedor no intente chatear consigo mismo
    if (emprendedorId === inversionistaId) {
      return NextResponse.json(
        { error: "No puedes crear un chat contigo mismo" },
        { status: 400 }
      );
    }

    // Verificar si ya existe un chat entre estos usuarios para esta solicitud
    let checkResult;
    try {
      checkResult = await sql`
        SELECT id_chat 
        FROM chats 
        WHERE inversionista_id = ${inversionistaId}
          AND emprendedor_id = ${emprendedorId}
          AND solicitud_id = ${solicitudId}
          AND tipo_solicitud = ${tipoSolicitud}
      `;
      console.log("Resultado de verificación:", checkResult);
    } catch (dbError) {
      console.error("Error en consulta de verificación:", dbError);
      return NextResponse.json(
        {
          error: "Error al verificar chat existente",
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    // Si ya existe un chat, retornar el existente
    if (checkResult && checkResult.length > 0) {
      return NextResponse.json({
        message: "Chat ya existe",
        chatId: checkResult[0].id_chat,
        exists: true,
      });
    }

    // Crear nuevo chat
    let result;
    try {
      result = await sql`
        INSERT INTO chats (
          inversionista_id,
          emprendedor_id,
          solicitud_id,
          tipo_solicitud,
          emprendimiento_id,
          estado
        ) VALUES (
          ${inversionistaId},
          ${emprendedorId},
          ${solicitudId},
          ${tipoSolicitud},
          ${emprendimientoId},
          'activo'
        )
        RETURNING id_chat, fecha_inicio
      `;
      console.log("Chat creado:", result[0]);
    } catch (dbError) {
      console.error("Error al insertar chat:", dbError);
      return NextResponse.json(
        {
          error: "Error al insertar chat en la base de datos",
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Chat creado exitosamente",
        chatId: result[0].id_chat,
        fechaInicio: result[0].fecha_inicio,
        exists: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error general al crear chat:", error);
    return NextResponse.json(
      {
        error: "Error al crear chat",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
