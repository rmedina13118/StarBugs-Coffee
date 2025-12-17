import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const clientes = await query(`
      SELECT 
        ID_Cliente as id,
        Nombre as Nombre,
        Email as Email,
        Telefono as Telefono,
        Fecha_Registro as Fecha_Registro
      FROM Cliente
      ORDER BY Nombre ASC
      LIMIT 100
    `)
    return NextResponse.json({ clientes })
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al obtener clientes", message: (error as any)?.message || String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.nombre) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })

    const res: any = await query("INSERT INTO Cliente (Nombre, Email, Telefono) VALUES (?, ?, ?)", [
      body.nombre,
      body.email || null,
      body.telefono || null,
    ])

    return NextResponse.json({ success: true, id: res.insertId })
  } catch (error) {
    console.error("Error al crear cliente:", error)
    return NextResponse.json({ error: "Error al crear cliente", message: (error as any)?.message || String(error) }, { status: 500 })
  }
}
