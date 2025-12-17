import { query } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ClientePage({ params }: { params: any }) {
  const { id } = await params
  if (!id) return (<div>Cliente no encontrado</div>)

  try {
    const clienteRes: any = await query(`SELECT ID_Cliente as id, Nombre as Nombre, Email as Email, Telefono as Telefono, Fecha_Registro as Fecha_Registro FROM Cliente WHERE ID_Cliente = ?`, [id])
    if (!clienteRes || clienteRes.length === 0) {
      return (<div>Cliente no encontrado</div>)
    }
    const cliente = clienteRes[0]

    const pedidos: any = await query(`
      SELECT p.ID_Pedido as id, p.Fecha_Hora, p.Estado, COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario),0) as total
      FROM Pedido p
      LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
      WHERE p.ID_Cliente = ?
      GROUP BY p.ID_Pedido
      ORDER BY p.Fecha_Hora DESC
      LIMIT 50
    `, [id])

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{cliente.Nombre}</h1>
            <p className="text-sm text-muted-foreground">{cliente.Email} — {cliente.Telefono}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/clientes"><Button variant="outline">Volver</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              { (pedidos || []).map((p: any) => (
                <li key={p.id} className="py-2 border-b flex justify-between">
                  <div>
                    <div className="font-medium">Pedido #{p.id}</div>
                    <div className="text-sm text-muted-foreground">{p.Fecha_Hora ? new Date(p.Fecha_Hora).toLocaleString() : ''}</div>
                  </div>
                  <div className="text-right">
                    <div>${Number(p.total || 0).toFixed(2)}</div>
                    <div className="text-sm">{p.Estado}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error getting cliente page:', error)
    return (<div>Error al obtener datos del cliente</div>)
  }
}
