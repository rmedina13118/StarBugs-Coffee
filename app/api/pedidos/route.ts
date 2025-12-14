import { NextResponse } from "next/server"
import { query } from "@/lib/db"


export async function GET() {
  try {
  const pedidos = await query(`
    SELECT 
      p.ID_Pedido as id,
      p.Fecha_Hora,
      p.Estado,
      c.Nombre as cliente_nombre,
      e.Nombre as empleado_nombre,
      COUNT(dp.ID_Detalle) as total_items,
      COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_precio
    FROM Pedido p
    LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente  
    LEFT JOIN Empleado e ON p.ID_Empleado = e.ID_Empleado
    LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
    GROUP BY p.ID_Pedido, p.Fecha_Hora, p.Estado, c.Nombre, e.Nombre
    ORDER BY p.Fecha_Hora DESC 
    LIMIT 10
  `)


    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error(" Error en consulta:", error)
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()


    const result = await query("INSERT INTO Pedido (ID_Cliente, ID_Empleado) VALUES (?, ?)", [
      body.clienteId,
      body.empleadoId
    ])


    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error al insertar:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
