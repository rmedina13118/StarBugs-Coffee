import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT 
        m.ID_Movimiento,
        m.ID_Insumo,
        m.ID_Proveedor,
        m.ID_Pedido,
        m.Tipo,
        m.Cantidad,
        m.Fecha,
        i.Nombre as Insumo_Nombre,
        p.Nombre as Proveedor_Nombre
      FROM Movimiento_Insumo m
      LEFT JOIN Insumo i ON m.ID_Insumo = i.ID_Insumo
      LEFT JOIN Proveedor p ON m.ID_Proveedor = p.ID_Proveedor
      ORDER BY m.Fecha DESC 
      LIMIT 200
    `)
    return new Response(JSON.stringify({ ok: true, movimientos: rows }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/movimientos error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching movimientos' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ID_Insumo, ID_Proveedor, ID_Pedido, Tipo, Cantidad } = body || {}
    
    // Validar que Tipo sea válido
    if (Tipo && !['Entrada', 'Salida'].includes(Tipo)) {
      return new Response(JSON.stringify({ ok: false, error: 'Tipo debe ser Entrada o Salida' }), { status: 400 })
    }
    
    const res: any = await query(
      `INSERT INTO Movimiento_Insumo (ID_Insumo, ID_Proveedor, ID_Pedido, Tipo, Cantidad) VALUES (?, ?, ?, ?, ?)`, 
      [ID_Insumo ?? null, ID_Proveedor || null, ID_Pedido || null, Tipo || null, Cantidad ?? 0]
    )
    
    // Si es Entrada, actualizar Stock_Actual del insumo
    if (Tipo === 'Entrada' && ID_Insumo) {
      await query(`UPDATE Insumo SET Stock_Actual = Stock_Actual + ? WHERE ID_Insumo = ?`, [Cantidad, ID_Insumo])
    }
    // Si es Salida, descontar del Stock_Actual
    if (Tipo === 'Salida' && ID_Insumo) {
      await query(`UPDATE Insumo SET Stock_Actual = Stock_Actual - ? WHERE ID_Insumo = ?`, [Cantidad, ID_Insumo])
    }
    
    return new Response(JSON.stringify({ ok: true, id: res.insertId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/movimientos error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error creating movimiento' }), { status: 500 })
  }
}
