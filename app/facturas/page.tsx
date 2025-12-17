import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function FacturasPage() {
  try {
    const res = await fetch('http://localhost:3000/api/facturas', { cache: 'no-store' })
    const data = await res.json()
    const facturas = data.facturas || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Facturas</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {facturas.map((f: any) => (
                <li key={f.ID_Factura || f.id} className="py-2 border-b">
                  <Link href={`/facturas/${f.ID_Factura || f.id}`}>Factura #{f.ID_Factura || f.id} — ${Number(f.Total || 0).toFixed(2)}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Facturas page error', err)
    return <div>Error al cargar facturas</div>
  }
}
