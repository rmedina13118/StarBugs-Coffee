import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT 
        r.ID_Receta,
        r.ID_Producto,
        r.ID_Insumo,
        r.Cantidad,
        p.Nombre as Producto_Nombre,
        i.Nombre as Insumo_Nombre,
        i.Unidad_Medida
      FROM Receta r
      LEFT JOIN Producto p ON r.ID_Producto = p.ID_Producto
      LEFT JOIN Insumo i ON r.ID_Insumo = i.ID_Insumo
      ORDER BY p.Nombre, i.Nombre
    `) 
    return new Response(JSON.stringify({ ok: true, recetas: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/recetas error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching recetas' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ID_Producto, ID_Insumo, Cantidad } = body || {}
    
    if (!ID_Producto || !ID_Insumo || !Cantidad) {
      return new Response(JSON.stringify({ ok: false, error: 'ID_Producto, ID_Insumo y Cantidad son requeridos' }), { status: 400 })
    }
    
    const res: any = await query(
      `INSERT INTO Receta (ID_Producto, ID_Insumo, Cantidad) VALUES (?, ?, ?)`, 
      [ID_Producto, ID_Insumo, Cantidad]
    )
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/recetas error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating receta' }), { status: 500 })
  }
}
