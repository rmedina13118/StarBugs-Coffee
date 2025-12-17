import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; detalleId: string }> }
) {
  try {
    const { id, detalleId } = await params
    const body = await request.json()

    await query(
      "UPDATE Detalle_Pedido SET Cantidad = ?, Precio_Unitario = ? WHERE ID_Detalle = ? AND ID_Pedido = ?",
      [body.cantidad, body.precioUnitario, detalleId, id]
    )

    return NextResponse.json({ 
      success: true,
      message: "Detalle actualizado"
    })
  } catch (error) {
    console.error("Error al actualizar:", error)
    return NextResponse.json({ error: "Error al actualizar detalle" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; detalleId: string }> }
) {
  try {
    const { id, detalleId } = await params

    const result = await query(
      "DELETE FROM Detalle_Pedido WHERE ID_Detalle = ? AND ID_Pedido = ?",
      [detalleId, id]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Detalle no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Detalle eliminado del pedido"
    })
  } catch (error) {
    console.error("Error al eliminar:", error)
    return NextResponse.json({ error: "Error al eliminar detalle" }, { status: 500 })
  }
}