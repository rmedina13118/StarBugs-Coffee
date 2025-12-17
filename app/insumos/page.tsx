import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function InsumosPage() {
  try {
    const res = await fetch('http://localhost:3000/api/insumos', { cache: 'no-store' })
    const data = await res.json()
    const insumos = data.insumos || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Insumos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {insumos.map((i: any) => (
                <li key={i.ID_Insumo || i.id} className="py-2 border-b">
                  <Link href={`/insumos/${i.ID_Insumo || i.id}`}>{i.Nombre} — {i.Stock}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Insumos page error', err)
    return <div>Error al cargar insumos</div>
  }
}
