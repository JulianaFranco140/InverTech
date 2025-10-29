import { NextResponse } from "next/server";
import sql from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

// Definir las funciones que la IA puede llamar
const availableFunctions = {
  obtener_emprendimientos: async (params) => {
    const { limite = 10, categoria } = params;

    try {
      let result;
      if (categoria) {
        result = await sql`
          SELECT 
            e.*,
            u.nombre as emprendedor_nombre,
            u.correo_electronico as emprendedor_email,
            c.nombre_categoria as categoria_nombre
          FROM emprendimientos e
          JOIN usuarios u ON e.emprendedor_id = u.id_usuario
          LEFT JOIN categorias c ON e.categoria = c.id_categoria
          WHERE e.categoria = ${categoria}
          ORDER BY e.fecha_creacion DESC
          LIMIT ${limite}
        `;
      } else {
        result = await sql`
          SELECT 
            e.*,
            u.nombre as emprendedor_nombre,
            u.correo_electronico as emprendedor_email,
            c.nombre_categoria as categoria_nombre
          FROM emprendimientos e
          JOIN usuarios u ON e.emprendedor_id = u.id_usuario
          LEFT JOIN categorias c ON e.categoria = c.id_categoria
          ORDER BY e.fecha_creacion DESC
          LIMIT ${limite}
        `;
      }

      return result;
    } catch (error) {
      console.error("Error en obtener_emprendimientos:", error);
      return [];
    }
  },

  obtener_inversores: async (params) => {
    const { limite = 10 } = params;

    try {
      const result = await sql`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.correo_electronico,
          u.telefono
        FROM usuarios u
        WHERE u.rol_id = 2
        ORDER BY u.id_usuario DESC
        LIMIT ${limite}
      `;
      return result;
    } catch (error) {
      console.error("Error en obtener_inversores:", error);
      return [];
    }
  },

  buscar_emprendimiento_por_nombre: async (params) => {
    const { nombre } = params;

    try {
      const searchTerm = `%${nombre}%`;
      const result = await sql`
        SELECT 
          e.*,
          u.nombre as emprendedor_nombre,
          u.correo_electronico as emprendedor_email,
          c.nombre_categoria as categoria_nombre
        FROM emprendimientos e
        JOIN usuarios u ON e.emprendedor_id = u.id_usuario
        LEFT JOIN categorias c ON e.categoria = c.id_categoria
        WHERE e.nombre ILIKE ${searchTerm}
           OR e.descripcion ILIKE ${searchTerm}
        ORDER BY e.fecha_creacion DESC
        LIMIT 5
      `;
      return result;
    } catch (error) {
      console.error("Error en buscar_emprendimiento_por_nombre:", error);
      return [];
    }
  },

  obtener_estadisticas_usuario: async (params) => {
    const { usuario_id } = params;

    try {
      const [
        emprendimientos,
        solicitudesEnviadas,
        solicitudesRecibidas,
        chatsActivos,
      ] = await Promise.all([
        sql`SELECT COUNT(*) as total FROM emprendimientos WHERE emprendedor_id = ${usuario_id}`,
        sql`SELECT COUNT(*) as total FROM solicitudes_financiamiento WHERE emprendedor_id = ${usuario_id}`,
        sql`SELECT COUNT(*) as total FROM solicitudes_contacto WHERE inversionista_id = ${usuario_id}`,
        sql`SELECT COUNT(*) as total FROM chats WHERE emprendedor_id = ${usuario_id} OR inversionista_id = ${usuario_id}`,
      ]);

      return {
        total_emprendimientos: parseInt(emprendimientos[0].total),
        total_solicitudes_enviadas: parseInt(solicitudesEnviadas[0].total),
        total_solicitudes_recibidas: parseInt(solicitudesRecibidas[0].total),
        total_chats_activos: parseInt(chatsActivos[0].total),
      };
    } catch (error) {
      console.error("Error en obtener_estadisticas_usuario:", error);
      return {
        total_emprendimientos: 0,
        total_solicitudes_enviadas: 0,
        total_solicitudes_recibidas: 0,
        total_chats_activos: 0,
      };
    }
  },

  obtener_conversaciones_usuario: async (params) => {
    const { usuario_id } = params;

    try {
      const result = await sql`
        SELECT 
          c.id_chat,
          c.fecha_inicio,
          c.estado,
          e.nombre as emprendimiento_nombre,
          CASE 
            WHEN c.inversionista_id = ${usuario_id} THEN u_emp.nombre
            ELSE u_inv.nombre
          END as contacto_nombre,
          (SELECT COUNT(*) FROM mensajes_chat m 
           WHERE m.chat_id = c.id_chat 
           AND m.leido = false 
           AND m.remitente_id != ${usuario_id}) as mensajes_no_leidos,
          (SELECT mensaje FROM mensajes_chat m 
           WHERE m.chat_id = c.id_chat 
           ORDER BY m.fecha_envio DESC LIMIT 1) as ultimo_mensaje
        FROM chats c
        JOIN emprendimientos e ON c.emprendimiento_id = e.id_emprendimiento
        JOIN usuarios u_inv ON c.inversionista_id = u_inv.id_usuario
        JOIN usuarios u_emp ON c.emprendedor_id = u_emp.id_usuario
        WHERE c.inversionista_id = ${usuario_id} OR c.emprendedor_id = ${usuario_id}
        ORDER BY c.fecha_inicio DESC
        LIMIT 10
      `;
      return result;
    } catch (error) {
      console.error("Error en obtener_conversaciones_usuario:", error);
      return [];
    }
  },

  obtener_solicitudes_financiamiento: async (params) => {
    const { limite = 10, estado } = params;

    try {
      let result;
      if (estado) {
        result = await sql`
          SELECT 
            sf.*,
            e.nombre as emprendimiento_nombre,
            u.nombre as emprendedor_nombre
          FROM solicitudes_financiamiento sf
          JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
          JOIN usuarios u ON sf.emprendedor_id = u.id_usuario
          WHERE sf.estado = ${estado}
          ORDER BY sf.fecha_solicitud DESC
          LIMIT ${limite}
        `;
      } else {
        result = await sql`
          SELECT 
            sf.*,
            e.nombre as emprendimiento_nombre,
            u.nombre as emprendedor_nombre
          FROM solicitudes_financiamiento sf
          JOIN emprendimientos e ON sf.emprendimiento_id = e.id_emprendimiento
          JOIN usuarios u ON sf.emprendedor_id = u.id_usuario
          ORDER BY sf.fecha_solicitud DESC
          LIMIT ${limite}
        `;
      }
      return result;
    } catch (error) {
      console.error("Error en obtener_solicitudes_financiamiento:", error);
      return [];
    }
  },
};

// Definición de herramientas para el modelo
const tools = [
  {
    type: "function",
    function: {
      name: "obtener_emprendimientos",
      description:
        "Obtiene una lista de emprendimientos disponibles en la plataforma. Útil para mostrar proyectos a inversores.",
      parameters: {
        type: "object",
        properties: {
          limite: {
            type: "number",
            description:
              "Número máximo de emprendimientos a retornar (por defecto 10)",
          },
          categoria: {
            type: "string",
            description:
              "Filtrar por categoría específica (ej: tecnología, salud, educación)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "obtener_inversores",
      description:
        "Obtiene una lista de inversores registrados en la plataforma.",
      parameters: {
        type: "object",
        properties: {
          limite: {
            type: "number",
            description: "Número máximo de inversores a retornar",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buscar_emprendimiento_por_nombre",
      description:
        "Busca emprendimientos específicos por nombre o palabra clave en nombre o descripción.",
      parameters: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre o palabra clave del emprendimiento a buscar",
          },
        },
        required: ["nombre"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "obtener_estadisticas_usuario",
      description:
        "Obtiene estadísticas del usuario actual (emprendimientos creados, solicitudes enviadas, chats activos, etc.)",
      parameters: {
        type: "object",
        properties: {
          usuario_id: {
            type: "number",
            description: "ID del usuario",
          },
        },
        required: ["usuario_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "obtener_conversaciones_usuario",
      description:
        "Obtiene las conversaciones activas del usuario con mensajes no leídos y último mensaje.",
      parameters: {
        type: "object",
        properties: {
          usuario_id: {
            type: "number",
            description: "ID del usuario",
          },
        },
        required: ["usuario_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "obtener_solicitudes_financiamiento",
      description:
        "Obtiene solicitudes de financiamiento de la plataforma, opcionalmente filtradas por estado.",
      parameters: {
        type: "object",
        properties: {
          limite: {
            type: "number",
            description: "Número máximo de solicitudes a retornar",
          },
          estado: {
            type: "string",
            description:
              "Filtrar por estado (pendiente, aprobada, rechazada, en_revision, etc.)",
          },
        },
      },
    },
  },
];

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

    const { messages } = await request.json();
    const usuarioId = decoded.userId;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensajes no proporcionados o formato inválido" },
        { status: 400 }
      );
    }

    // Verificar que la API key esté configurada
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      );
    }

    // Obtener el último mensaje del usuario
    const lastUserMessage =
      messages[messages.length - 1]?.content?.toLowerCase() || "";

    // Detectar qué información necesita el usuario y consultar la BD
    let contextData = "";

    // Detectar palabras clave y ejecutar consultas
    if (
      lastUserMessage.includes("emprendimiento") ||
      lastUserMessage.includes("proyecto") ||
      lastUserMessage.includes("negocio")
    ) {
      const emprendimientos = await availableFunctions.obtener_emprendimientos({
        limite: 5,
      });
      if (emprendimientos.length > 0) {
        contextData += "\n\nEmprendimientos disponibles:\n";
        emprendimientos.forEach((e, i) => {
          contextData += `${i + 1}. ${e.nombre} - Categoría: ${
            e.categoria_nombre || "Sin categoría"
          }, Ingresos: $${e.ingresos_mensuales}, Empleados: ${
            e.cantidad_empleados
          }, Clientes: ${e.cantidad_clientes}, Emprendedor: ${
            e.emprendedor_nombre
          }\n`;
        });
      }
    }

    if (
      lastUserMessage.includes("estadística") ||
      (lastUserMessage.includes("mi") &&
        (lastUserMessage.includes("datos") ||
          lastUserMessage.includes("información")))
    ) {
      const stats = await availableFunctions.obtener_estadisticas_usuario({
        usuario_id: usuarioId,
      });
      contextData += "\n\nTus estadísticas:\n";
      contextData += `- Emprendimientos: ${stats.total_emprendimientos}\n`;
      contextData += `- Solicitudes enviadas: ${stats.total_solicitudes_enviadas}\n`;
      contextData += `- Solicitudes recibidas: ${stats.total_solicitudes_recibidas}\n`;
      contextData += `- Chats activos: ${stats.total_chats_activos}\n`;
    }

    if (
      lastUserMessage.includes("conversación") ||
      lastUserMessage.includes("chat") ||
      lastUserMessage.includes("mensaje")
    ) {
      const conversaciones =
        await availableFunctions.obtener_conversaciones_usuario({
          usuario_id: usuarioId,
        });
      if (conversaciones.length > 0) {
        contextData += "\n\nTus conversaciones activas:\n";
        conversaciones.forEach((c, i) => {
          contextData += `${i + 1}. Con ${c.contacto_nombre} sobre ${
            c.emprendimiento_nombre
          } - Mensajes no leídos: ${c.mensajes_no_leidos}\n`;
        });
      } else {
        contextData += "\n\nNo tienes conversaciones activas.\n";
      }
    }

    if (
      lastUserMessage.includes("inversor") ||
      lastUserMessage.includes("inversionista")
    ) {
      const inversores = await availableFunctions.obtener_inversores({
        limite: 5,
      });
      if (inversores.length > 0) {
        contextData += "\n\nInversores registrados:\n";
        inversores.forEach((inv, i) => {
          contextData += `${i + 1}. ${inv.nombre} - Email: ${
            inv.correo_electronico
          }\n`;
        });
      }
    }

    if (
      lastUserMessage.includes("solicitud") &&
      lastUserMessage.includes("financiamiento")
    ) {
      const solicitudes =
        await availableFunctions.obtener_solicitudes_financiamiento({
          limite: 5,
        });
      if (solicitudes.length > 0) {
        contextData += "\n\nSolicitudes de financiamiento:\n";
        solicitudes.forEach((s, i) => {
          contextData += `${i + 1}. ${s.emprendimiento_nombre} - Monto: $${
            s.monto_solicitado
          }, Estado: ${s.estado}\n`;
        });
      }
    }

    // Buscar por nombre específico
    const buscarMatch = lastUserMessage.match(
      /busca(?:r)?.*"([^"]+)"|busca(?:r)?\s+(\w+)/i
    );
    if (buscarMatch) {
      const nombreBusqueda = buscarMatch[1] || buscarMatch[2];
      const resultados =
        await availableFunctions.buscar_emprendimiento_por_nombre({
          nombre: nombreBusqueda,
        });
      if (resultados.length > 0) {
        contextData += `\n\nResultados de búsqueda para "${nombreBusqueda}":\n`;
        resultados.forEach((r, i) => {
          contextData += `${i + 1}. ${r.nombre} - ${r.descripcion?.substring(
            0,
            100
          )}...\n`;
        });
      } else {
        contextData += `\n\nNo se encontraron emprendimientos con el nombre "${nombreBusqueda}".\n`;
      }
    }

    // Filtrar por categoría
    const categoriaMatch = lastUserMessage.match(
      /categoría\s+(\w+)|de\s+(\w+)/i
    );
    if (
      categoriaMatch &&
      (lastUserMessage.includes("emprendimiento") ||
        lastUserMessage.includes("tecnología") ||
        lastUserMessage.includes("salud"))
    ) {
      const categoria = categoriaMatch[1] || categoriaMatch[2];
      const resultados = await availableFunctions.obtener_emprendimientos({
        limite: 5,
        categoria,
      });
      if (resultados.length > 0) {
        contextData += `\n\nEmprendimientos de ${categoria}:\n`;
        resultados.forEach((r, i) => {
          contextData += `${i + 1}. ${r.nombre} - ${r.descripcion?.substring(
            0,
            80
          )}...\n`;
        });
      }
    }

    // Construir mensajes con contexto
    const messagesWithContext = [
      {
        role: "system",
        content: `Eres un asistente inteligente para InverTech, una plataforma que conecta inversores con emprendedores.

Tu función es:
- Ayudar a los usuarios a encontrar emprendimientos relevantes
- Proporcionar información sobre inversores
- Consultar estadísticas de usuarios
- Facilitar la comunicación entre inversores y emprendedores
- Responder preguntas sobre la plataforma

El ID del usuario actual es: ${usuarioId}

${
  contextData
    ? `\n--- DATOS DE LA BASE DE DATOS ---${contextData}\n--- FIN DE DATOS ---\n`
    : ""
}

Usa los datos proporcionados arriba para responder. Si no hay datos relevantes, responde de manera general y amigable.
Sé profesional, claro y conciso en tus respuestas. No menciones que los datos vienen de una "base de datos", simplemente preséntala información.`,
      },
      ...messages,
    ];

    // Llamada a la API (sin function calling)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "InverTech AI Assistant",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: messagesWithContext,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en OpenRouter:", errorText);
      throw new Error(`Error en OpenRouter: ${response.statusText}`);
    }

    const data = await response.json();
    let content =
      data.choices[0]?.message?.content || "No se pudo obtener respuesta.";

    // Formatear la respuesta para mejorar legibilidad
    content = content
      .replace(/^#+ (.+)$/gm, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/^\* (.+)$/gm, "• $1")
      .replace(/^(\d+)\. (.+)$/gm, "$1. $2")
      .replace(/\n\n+/g, "\n\n")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1");

    return NextResponse.json({
      content,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Error en AI chat:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud: " + error.message },
      { status: 500 }
    );
  }
}
