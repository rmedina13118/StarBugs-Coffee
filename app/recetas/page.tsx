import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RecetasPage() {
  try {
    const res = await fetch('http://localhost:3000/api/recetas', { cache: 'no-store' })
    const data = await res.json()
    const recetas = data.recetas || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Recetas</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {recetas.map((r: any) => (
                <li key={r.ID_Receta || r.id} className="py-2 border-b">
                  <Link href={`/recetas/${r.ID_Receta || r.id}`}>{r.Nombre}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Recetas page error', err)
    return <div>Error al cargar recetas</div>
  }
}
