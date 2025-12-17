import { query } from '@/lib/db'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const rows: any = await query(`SELECT * FROM Empleado WHERE ID_Empleado = ?`, [id])
    if (!rows || rows.length === 0) return new Response(JSON.stringify({ ok: false, error: 'Not found' }), { status: 404 })
    return new Response(JSON.stringify({ ok: true, empleado: rows[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/empleados/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error fetching empleado' }), { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params
    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    for (const k of ['Nombre', 'Email', 'Telefono']) {
      if (body[k] !== undefined) { fields.push(`${k} = ?`); values.push(body[k]) }
    }
    if (fields.length === 0) return new Response(JSON.stringify({ ok: false, error: 'No fields' }), { status: 400 })
    values.push(id)
    await query(`UPDATE Empleado SET ${fields.join(', ')} WHERE ID_Empleado = ?`, values)
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('PATCH /api/empleados/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error updating empleado' }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params
    await query(`DELETE FROM Empleado WHERE ID_Empleado = ?`, [id])
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('DELETE /api/empleados/[id] error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error deleting empleado' }), { status: 500 })
  }
}
