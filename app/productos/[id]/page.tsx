import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProductoPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Producto no encontrado</div>
    const p = data.producto
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{p.Nombre}</h1>
          <Link href="/productos">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Precio: ${Number(p.Precio || 0).toFixed(2)}</div>
            <div>Stock: {p.Stock ?? '-'}</div>
            <div>Categoria: {p.ID_Categoria ?? '-'}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Producto page error', err)
    return <div>Error al cargar producto</div>
  }
}
