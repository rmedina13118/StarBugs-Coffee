import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT 
        f.ID_Factura,
        f.ID_Pedido,
        f.Fecha_Emision,
        f.Metodo_Pago,
        p.Fecha_Hora as Fecha_Pedido,
        c.Nombre as Cliente_Nombre,
        COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as Total
      FROM Factura f
      LEFT JOIN Pedido p ON f.ID_Pedido = p.ID_Pedido
      LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente
      LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
      GROUP BY f.ID_Factura, f.ID_Pedido, f.Fecha_Emision, f.Metodo_Pago, p.Fecha_Hora, c.Nombre
      ORDER BY f.Fecha_Emision DESC 
      LIMIT 200
    `)
    return new Response(JSON.stringify({ ok: true, facturas: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/facturas error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching facturas' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ID_Pedido, Metodo_Pago } = body || {}
    const res: any = await query(
      `INSERT INTO Factura (ID_Pedido, Metodo_Pago) VALUES (?, ?)`, 
      [ID_Pedido ?? null, Metodo_Pago || null]
    )
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/facturas error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating factura' }), { status: 500 })
  }
}
