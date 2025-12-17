import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CategoriasPage() {
  try {
    const res = await fetch('http://localhost:3000/api/categorias', { cache: 'no-store' })
    const data = await res.json()
    const categorias = data.categorias || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Categorías</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {categorias.map((c: any) => (
                <li key={c.ID_Categoria || c.id} className="py-2 border-b">
                  <Link href={`/categorias/${c.ID_Categoria || c.id}`}>{c.Nombre}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Categorias page error', err)
    return <div>Error al cargar categorias</div>
  }
}
