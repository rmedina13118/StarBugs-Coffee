import { query } from '@/lib/db'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const rows: any = await query(`SELECT * FROM Insumo WHERE ID_Insumo = ?`, [id])
    if (!rows || rows.length === 0) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 })
    return new Response(JSON.stringify({ ok: true, insumo: rows[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/insumos/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching insumo' }), { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params
    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    for (const k of ['Nombre', 'Stock', 'Unidad']) {
      if (body[k] !== undefined) { fields.push(`${k} = ?`); values.push(body[k]) }
    }
    if (fields.length === 0) return new Response(JSON.stringify({ ok: false, error: 'No fields' }), { status: 400 })
    values.push(id)
    await query(`UPDATE Insumo SET ${fields.join(', ')} WHERE ID_Insumo = ?`, values)
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('PATCH /api/insumos/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error updating insumo' }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params
    await query(`DELETE FROM Insumo WHERE ID_Insumo = ?`, [id])
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('DELETE /api/insumos/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error deleting insumo' }), { status: 500 })
  }
}
