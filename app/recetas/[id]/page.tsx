import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RecetaPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/recetas/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Receta no encontrada</div>
    const r = data.receta
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{r.Nombre}</h1>
          <Link href="/recetas">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{r.Instrucciones}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Receta page error', err)
    return <div>Error al cargar receta</div>
  }
}
