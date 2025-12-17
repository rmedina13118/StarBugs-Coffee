import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MovimientoPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/movimientos/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Movimiento no encontrado</div>
    const m = data.movimiento
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Movimiento #{m.ID_Movimiento}</h1>
          <Link href="/movimientos">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>ID Insumo: {m.ID_Insumo}</div>
            <div>Cantidad: {m.Cantidad}</div>
            <div>Tipo: {m.Tipo}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Movimiento page error', err)
    return <div>Error al cargar movimiento</div>
  }
}
