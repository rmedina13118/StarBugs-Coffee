import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cliente = await query(`SELECT ID_Cliente as id, Nombre as Nombre, Email as Email, Telefono as Telefono, Fecha_Registro as Fecha_Registro FROM Cliente WHERE ID_Cliente = ?`, [id])
    if (!cliente || (cliente as any[]).length === 0) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })

    const pedidos = await query(`
      SELECT p.ID_Pedido as id, p.Fecha_Hora, p.Estado, COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario),0) as total
      FROM Pedido p
      LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
      WHERE p.ID_Cliente = ?
      GROUP BY p.ID_Pedido
      ORDER BY p.Fecha_Hora DESC
      LIMIT 50
    `, [id])

    return NextResponse.json({ cliente: (cliente as any)[0], pedidos })
  } catch (error) {
    console.error("Error al obtener cliente:", error)
    return NextResponse.json({ error: "Error al obtener cliente", message: (error as any)?.message || String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates: string[] = []
    const values: any[] = []
    
    // Nombre es requerido si se envía
    if (body.nombre !== undefined) {
      if (!body.nombre || body.nombre.trim() === "") {
        return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 })
      }
      updates.push("Nombre = ?")
      values.push(body.nombre.trim())
    }
    
    // Email puede ser null si se envía vacío
    if (body.email !== undefined) {
      updates.push("Email = ?")
      const emailValue = body.email && typeof body.email === 'string' && body.email.trim() !== "" 
        ? body.email.trim() 
        : null
      values.push(emailValue)
    }
    
    // Telefono puede ser null si se envía vacío
    if (body.telefono !== undefined) {
      updates.push("Telefono = ?")
      const telefonoValue = body.telefono && typeof body.telefono === 'string' && body.telefono.trim() !== "" 
        ? body.telefono.trim() 
        : null
      values.push(telefonoValue)
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
    }
    
    // Asegurar que todos los valores sean válidos (no undefined)
    const validValues = values.map(v => v === undefined ? null : v)
    validValues.push(id)
    
    await query(`UPDATE Cliente SET ${updates.join(', ')} WHERE ID_Cliente = ?`, validValues)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar cliente", message: (error as any)?.message || String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // comprobar pedidos
    const res: any = await query('SELECT COUNT(*) as c FROM Pedido WHERE ID_Cliente = ?', [id])
    if (res && res[0] && res[0].c > 0) return NextResponse.json({ error: "Cliente tiene pedidos asociados" }, { status: 400 })
    await query('DELETE FROM Cliente WHERE ID_Cliente = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    return NextResponse.json({ error: "Error al eliminar cliente", message: (error as any)?.message || String(error) }, { status: 500 })
  }
}
