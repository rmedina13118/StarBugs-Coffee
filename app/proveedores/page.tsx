import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProveedoresPage() {
  try {
    const res = await fetch('http://localhost:3000/api/proveedores', { cache: 'no-store' })
    const data = await res.json()
    const proveedores = data.proveedores || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {proveedores.map((p: any) => (
                <li key={p.ID_Proveedor || p.id} className="py-2 border-b">
                  <Link href={`/proveedores/${p.ID_Proveedor || p.id}`}>{p.Nombre}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Proveedores page error', err)
    return <div>Error al cargar proveedores</div>
  }
}
