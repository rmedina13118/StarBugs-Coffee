import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM Categoria ORDER BY Nombre`)
    return new Response(JSON.stringify({ ok: true, categorias: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/categorias error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching categorias' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { Nombre, Descripcion } = body || {}
    const res: any = await query(`INSERT INTO Categoria (Nombre, Descripcion) VALUES (?, ?)`, [Nombre || null, Descripcion || null])
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/categorias error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating categoria' }), { status: 500 })
  }
}
