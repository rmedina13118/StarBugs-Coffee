import { query } from '@/lib/db'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const rows: any = await query(`SELECT * FROM Proveedor WHERE ID_Proveedor = ?`, [id])
    if (!rows || rows.length === 0) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 })
    return new Response(JSON.stringify({ ok: true, proveedor: rows[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/proveedores/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching proveedor' }), { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params
    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    for (const k of ['Nombre', 'Contacto', 'Telefono']) {
      if (body[k] !== undefined) { fields.push(`${k} = ?`); values.push(body[k]) }
    }
    if (fields.length === 0) return new Response(JSON.stringify({ ok: false, error: 'No fields' }), { status: 400 })
    values.push(id)
    await query(`UPDATE Proveedor SET ${fields.join(', ')} WHERE ID_Proveedor = ?`, values)
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('PATCH /api/proveedores/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error updating proveedor' }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params
    await query(`DELETE FROM Proveedor WHERE ID_Proveedor = ?`, [id])
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('DELETE /api/proveedores/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error deleting proveedor' }), { status: 500 })
  }
}
