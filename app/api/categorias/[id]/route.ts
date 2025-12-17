import { query } from '@/lib/db'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const rows: any = await query(`SELECT * FROM Categoria WHERE ID_Categoria = ?`, [id])
    if (!rows || rows.length === 0) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 })
    return new Response(JSON.stringify({ ok: true, categoria: rows[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/categorias/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching categoria' }), { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params
    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    for (const k of ['Nombre', 'Descripcion']) {
      if (body[k] !== undefined) { fields.push(`${k} = ?`); values.push(body[k]) }
    }
    if (fields.length === 0) return new Response(JSON.stringify({ ok: false, error: 'No fields' }), { status: 400 })
    values.push(id)
    await query(`UPDATE Categoria SET ${fields.join(', ')} WHERE ID_Categoria = ?`, values)
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('PATCH /api/categorias/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error updating categoria' }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params
    await query(`DELETE FROM Categoria WHERE ID_Categoria = ?`, [id])
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('DELETE /api/categorias/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error deleting categoria' }), { status: 500 })
  }
}
