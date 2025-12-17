import { query } from '@/lib/db'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const rows: any = await query(`SELECT * FROM Movimiento_Insumo WHERE ID_Movimiento = ?`, [id])
    if (!rows || rows.length === 0) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 })
    return new Response(JSON.stringify({ ok: true, movimiento: rows[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/movimientos/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching movimiento' }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params
    await query(`DELETE FROM Movimiento_Insumo WHERE ID_Movimiento = ?`, [id])
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('DELETE /api/movimientos/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error deleting movimiento' }), { status: 500 })
  }
}
