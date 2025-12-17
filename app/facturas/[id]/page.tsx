import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function FacturaPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/facturas/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Factura no encontrada</div>
    const f = data.factura
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Factura #{f.ID_Factura}</h1>
          <Link href="/facturas">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Pedido: {f.ID_Pedido}</div>
            <div>Total: ${Number(f.Total || 0).toFixed(2)}</div>
            <div>Método: {f.Metodo_Pago}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Factura page error', err)
    return <div>Error al cargar factura</div>
  }
}
