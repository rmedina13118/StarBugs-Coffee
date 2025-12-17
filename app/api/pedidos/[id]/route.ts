import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const pedido = await query(`
      SELECT 
        p.ID_Pedido as id,
        p.Fecha_Hora,
        p.Estado,
        p.ID_Cliente,
        p.ID_Empleado,
        c.Nombre as cliente_nombre,
        c.Email as cliente_email,
        c.Telefono as cliente_telefono,
        e.Nombre as empleado_nombre,
        COUNT(dp.ID_Detalle) as total_items,
        COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_precio
      FROM Pedido p
      LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente  
      LEFT JOIN Empleado e ON p.ID_Empleado = e.ID_Empleado
      LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
      WHERE p.ID_Pedido = ?
      GROUP BY p.ID_Pedido
    `, [id])

    if ((pedido as any[]).length === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const detalles = await query(`
      SELECT 
        dp.ID_Detalle,
        dp.ID_Producto,
        dp.Cantidad,
        dp.Precio_Unitario,
        pr.Nombre as producto_nombre
      FROM Detalle_Pedido dp
      LEFT JOIN Producto pr ON dp.ID_Producto = pr.ID_Producto
      WHERE dp.ID_Pedido = ?
    `, [id])

    return NextResponse.json({ 
      pedido: (pedido as any[])[0],
      detalles
    })
  } catch (error) {
    console.error("Error en consulta:", error)
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const estadosValidos = ['Entregado', 'En preparación', 'Cancelado', 'Pagado']
    
    if (body.estado && !estadosValidos.includes(body.estado)) {
      return NextResponse.json(
        { error: "Estado inválido" }, 
        { status: 400 }
      )
    }

    await query(
      "UPDATE Pedido SET Estado = ? WHERE ID_Pedido = ?",
      [body.estado, id]
    )

    return NextResponse.json({ 
      success: true,
      message: "Pedido actualizado exitosamente"
    })
  } catch (error) {
    console.error("Error al actualizar:", error)
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar si el pedido existe
    const pedido = await query("SELECT ID_Pedido FROM Pedido WHERE ID_Pedido = ?", [id])
    
    if ((pedido as any[]).length === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    // Eliminar detalles primero (FK)
    await query("DELETE FROM Detalle_Pedido WHERE ID_Pedido = ?", [id])

    // Eliminar pedido
    await query("DELETE FROM Pedido WHERE ID_Pedido = ?", [id])

    return NextResponse.json({ 
      success: true,
      message: "Pedido eliminado exitosamente"
    })
  } catch (error) {
    console.error("Error al eliminar:", error)
    return NextResponse.json({ error: "Error al eliminar pedido" }, { status: 500 })
  }
}
