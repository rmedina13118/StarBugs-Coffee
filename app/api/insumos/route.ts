import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const rows = await query(`SELECT * FROM Insumo ORDER BY Nombre`)
    return new Response(JSON.stringify({ ok: true, insumos: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/insumos error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching insumos' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { Nombre, Stock_Actual, Stock_Minimo, Precio_Unidad, Unidad_Medida } = body || {}
    const res: any = await query(
      `INSERT INTO Insumo (Nombre, Stock_Actual, Stock_Minimo, Precio_Unidad, Unidad_Medida) VALUES (?, ?, ?, ?, ?)`, 
      [Nombre || null, Stock_Actual ?? 0, Stock_Minimo ?? 0, Precio_Unidad || null, Unidad_Medida || null]
    )
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/insumos error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating insumo' }), { status: 500 })
  }
}
