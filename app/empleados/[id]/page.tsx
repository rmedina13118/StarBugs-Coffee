import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EmpleadoPage({ params }: any) {
  try {
    const { id } = await params
    const res = await fetch(`http://localhost:3000/api/empleados/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (!data.ok) return <div>Empleado no encontrado</div>
    const e = data.empleado
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{e.Nombre}</h1>
          <Link href="/empleados">Volver</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Email: {e.Email}</div>
            <div>Teléfono: {e.Telefono}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Empleado page error', err)
    return <div>Error al cargar empleado</div>
  }
}
