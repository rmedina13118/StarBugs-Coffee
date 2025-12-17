import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM Proveedor ORDER BY Nombre`)
    return new Response(JSON.stringify({ ok: true, proveedores: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/proveedores error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching proveedores' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { Nombre, Telefono, Email, Calle, Numero_Calle, Ciudad, Codigo_Postal } = body || {}
    
    if (!Nombre) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre es requerido' }), { status: 400 })
    }
    
    const res: any = await query(
      `INSERT INTO Proveedor (Nombre, Telefono, Email, Calle, Numero_Calle, Ciudad, Codigo_Postal) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [Nombre, Telefono || null, Email || null, Calle || null, Numero_Calle || null, Ciudad || null, Codigo_Postal || null]
    )
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/proveedores error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating proveedor' }), { status: 500 })
  }
}
