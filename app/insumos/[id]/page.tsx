import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function InsumoPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/insumos/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Insumo no encontrado</div>
    const i = data.insumo
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{i.Nombre}</h1>
          <Link href="/insumos">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Stock: {i.Stock}</div>
            <div>Unidad: {i.Unidad}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Insumo page error', err)
    return <div>Error al cargar insumo</div>
  }
}
