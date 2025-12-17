import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProveedorPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/proveedores/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Proveedor no encontrado</div>
    const p = data.proveedor
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{p.Nombre}</h1>
          <Link href="/proveedores">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Contacto: {p.Contacto}</div>
            <div>Teléfono: {p.Telefono}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Proveedor page error', err)
    return <div>Error al cargar proveedor</div>
  }
}
