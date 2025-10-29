import { NextResponse } from "next/server";
import sql from "../../../../../../lib/db";
import { verifyToken } from "../../../../../../lib/auth";

// PATCH - Marcar mensajes como leídos
export async function PATCH(request, { params }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = decoded.userId;
    const chatId = params.chatId;

    // Verificar que el usuario sea parte del chat
    const chatCheck = await sql`
      SELECT id_chat 
      FROM chats 
      WHERE id_chat = ${chatId}
        AND (emprendedor_id = ${userId} OR inversionista_id = ${userId})
    `;

    if (chatCheck.length === 0) {
      return NextResponse.json(
        { error: "No tienes acceso a este chat" },
        { status: 403 }
      );
    }

    // Marcar como leídos todos los mensajes que NO fueron enviados por el usuario actual
    const result = await sql`
      UPDATE mensajes_chat
      SET leido = true
      WHERE chat_id = ${chatId}
        AND remitente_id != ${userId}
        AND leido = false
      RETURNING id_mensaje
    `;

    return NextResponse.json({
      message: "Mensajes marcados como leídos",
      count: result.length,
    });
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
    return NextResponse.json(
      { error: "Error al marcar mensajes como leídos", details: error.message },
      { status: 500 }
    );
  }
}
