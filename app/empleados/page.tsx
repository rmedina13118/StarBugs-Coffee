import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EmpleadosPage() {
  try {
    const res = await fetch('http://localhost:3000/api/empleados', { cache: 'no-store' })
    const data = await res.json()
    const empleados = data.empleados || []
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Empleados</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {empleados.map((e: any) => (
                <li key={e.ID_Empleado || e.id} className="py-2 border-b">
                  <Link href={`/empleados/${e.ID_Empleado || e.id}`}>{e.Nombre}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  } catch (err) {
    console.error('Empleados page error', err)
    return <div>Error al cargar empleados</div>
  }
}
