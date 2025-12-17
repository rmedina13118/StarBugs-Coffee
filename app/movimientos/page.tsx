import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MovimientosPage() {
  try {
    const res = await fetch('http://localhost:3000/api/movimientos', { cache: 'no-store' })
    const data = await res.json()
    const movimientos = data.movimientos || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Movimientos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {movimientos.map((m: any) => (
                <li key={m.ID_Movimiento || m.id} className="py-2 border-b">
                  <Link href={`/movimientos/${m.ID_Movimiento || m.id}`}>{m.ID_Insumo} — {m.Cantidad} — {m.Tipo}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Movimientos page error', err)
    return <div>Error al cargar movimientos</div>
  }
}
