import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM Empleado ORDER BY Nombre`)
    return new Response(JSON.stringify({ ok: true, empleados: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/empleados error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching empleados' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { Nombre, Puesto, Email, Telefono } = body || {}
    
    if (!Nombre || !Puesto) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre y Puesto son requeridos' }), { status: 400 })
    }
    
    const res: any = await query(
      `INSERT INTO Empleado (Nombre, Puesto, Email, Telefono) VALUES (?, ?, ?, ?)`, 
      [Nombre, Puesto, Email || null, Telefono || null]
    )
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/empleados error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating empleado' }), { status: 500 })
  }
}
