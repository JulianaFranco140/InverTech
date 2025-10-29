import { NextResponse } from "next/server";
import sql from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export async function GET(request) {
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

    const userId = decoded.userId;
    const userRole = decoded.role;

    let result;

    // Si es emprendedor (role 1), obtener chats donde es emprendedor
    if (userRole === 1) {
      result = await sql`
        SELECT 
          c.id_chat,
          c.inversionista_id,
          c.emprendedor_id,
          c.solicitud_id,
          c.tipo_solicitud,
          c.emprendimiento_id,
          c.fecha_inicio,
          c.estado,
          u_inv.nombre as inversionista_nombre,
          u_inv.correo_electronico as inversionista_email,
          e.nombre as emprendimiento_nombre,
          (
            SELECT COUNT(*) 
            FROM mensajes_chat mc 
            WHERE mc.chat_id = c.id_chat 
              AND mc.remitente_id != ${userId}
              AND mc.leido = false
          ) as mensajes_no_leidos,
          (
            SELECT m.mensaje 
            FROM mensajes_chat m 
            WHERE m.chat_id = c.id_chat 
            ORDER BY m.fecha_envio DESC 
            LIMIT 1
          ) as ultimo_mensaje,
          (
            SELECT m.fecha_envio 
            FROM mensajes_chat m 
            WHERE m.chat_id = c.id_chat 
            ORDER BY m.fecha_envio DESC 
            LIMIT 1
          ) as fecha_ultimo_mensaje
        FROM chats c
        JOIN usuarios u_inv ON c.inversionista_id = u_inv.id_usuario
        JOIN emprendimientos e ON c.emprendimiento_id = e.id_emprendimiento
        WHERE c.emprendedor_id = ${userId}
          AND c.inversionista_id != ${userId}
        ORDER BY COALESCE(
          (SELECT m.fecha_envio FROM mensajes_chat m WHERE m.chat_id = c.id_chat ORDER BY m.fecha_envio DESC LIMIT 1),
          c.fecha_inicio
        ) DESC
      `;
    }
    // Si es inversionista (role 2), obtener chats donde es inversionista
    else if (userRole === 2) {
      result = await sql`
        SELECT 
          c.id_chat,
          c.inversionista_id,
          c.emprendedor_id,
          c.solicitud_id,
          c.tipo_solicitud,
          c.emprendimiento_id,
          c.fecha_inicio,
          c.estado,
          u_emp.nombre as emprendedor_nombre,
          u_emp.correo_electronico as emprendedor_email,
          e.nombre as emprendimiento_nombre,
          (
            SELECT COUNT(*) 
            FROM mensajes_chat mc 
            WHERE mc.chat_id = c.id_chat 
              AND mc.remitente_id != ${userId}
              AND mc.leido = false
          ) as mensajes_no_leidos,
          (
            SELECT m.mensaje 
            FROM mensajes_chat m 
            WHERE m.chat_id = c.id_chat 
            ORDER BY m.fecha_envio DESC 
            LIMIT 1
          ) as ultimo_mensaje,
          (
            SELECT m.fecha_envio 
            FROM mensajes_chat m 
            WHERE m.chat_id = c.id_chat 
            ORDER BY m.fecha_envio DESC 
            LIMIT 1
          ) as fecha_ultimo_mensaje
        FROM chats c
        JOIN usuarios u_emp ON c.emprendedor_id = u_emp.id_usuario
        JOIN emprendimientos e ON c.emprendimiento_id = e.id_emprendimiento
        WHERE c.inversionista_id = ${userId}
          AND c.emprendedor_id != ${userId}
        ORDER BY COALESCE(
          (SELECT m.fecha_envio FROM mensajes_chat m WHERE m.chat_id = c.id_chat ORDER BY m.fecha_envio DESC LIMIT 1),
          c.fecha_inicio
        ) DESC
      `;
    } else {
      return NextResponse.json({ error: "Rol no válido" }, { status: 403 });
    }

    return NextResponse.json({
      chats: result,
      userRole,
    });
  } catch (error) {
    console.error("Error al obtener chats:", error);
    return NextResponse.json(
      { error: "Error al obtener chats", details: error.message },
      { status: 500 }
    );
  }
}
