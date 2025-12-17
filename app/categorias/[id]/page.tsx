import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CategoriaPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/categorias/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Categoría no encontrada</div>
    const c = data.categoria
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{c.Nombre}</h1>
          <Link href="/categorias">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{c.Descripcion}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Categoria page error', err)
    return <div>Error al cargar categoría</div>
  }
}
