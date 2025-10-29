import { NextResponse } from "next/server";
import sql from "../../../../../lib/db";
import { verifyToken } from "../../../../../lib/auth";

// GET - Obtener mensajes de un chat
export async function GET(request, { params }) {
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

    // Obtener mensajes del chat
    const messages = await sql`
      SELECT 
        m.id_mensaje,
        m.chat_id,
        m.remitente_id,
        m.mensaje,
        m.fecha_envio,
        m.leido,
        u.nombre as remitente_nombre
      FROM mensajes_chat m
      JOIN usuarios u ON m.remitente_id = u.id_usuario
      WHERE m.chat_id = ${chatId}
      ORDER BY m.fecha_envio ASC
    `;

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return NextResponse.json(
      { error: "Error al obtener mensajes", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Enviar un mensaje
export async function POST(request, { params }) {
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
    const { mensaje } = await request.json();

    if (!mensaje || mensaje.trim() === "") {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

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

    // Insertar el mensaje
    const result = await sql`
      INSERT INTO mensajes_chat (
        chat_id,
        remitente_id,
        mensaje,
        leido
      ) VALUES (
        ${chatId},
        ${userId},
        ${mensaje.trim()},
        false
      )
      RETURNING id_mensaje, chat_id, remitente_id, mensaje, fecha_envio, leido
    `;

    // Obtener el nombre del remitente
    const user = await sql`
      SELECT nombre FROM usuarios WHERE id_usuario = ${userId}
    `;

    return NextResponse.json(
      {
        message: "Mensaje enviado exitosamente",
        data: {
          ...result[0],
          remitente_nombre: user[0].nombre,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    return NextResponse.json(
      { error: "Error al enviar mensaje", details: error.message },
      { status: 500 }
    );
  }
}
