import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, User, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default function DetallePedidoPage() {
  const pedido = {
    id: "#12345",
    fecha: "15 de Enero, 2024",
    cliente: "Juan Pérez",
    telefono: "+1 234 567 8900",
    direccion: "Calle Principal 123, Ciudad, CP 12345",
    estado: "En Proceso",
    items: [
      { id: 1, producto: "Producto A", cantidad: 2, precio: 25.99, subtotal: 51.98 },
      { id: 2, producto: "Producto B", cantidad: 1, precio: 35.5, subtotal: 35.5 },
      { id: 3, producto: "Producto C", cantidad: 3, precio: 15.75, subtotal: 47.25 },
    ],
    subtotal: 134.73,
    envio: 5.0,
    total: 139.73,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/pedidos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalle de Pedido {pedido.id}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Información del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{pedido.fecha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Items del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pedido.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{item.producto}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.cantidad} × ${item.precio.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-medium">{pedido.cliente}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium">{pedido.direccion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-medium">${pedido.envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-green-600">${pedido.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Actualizar Estado</Button>
          </div>
        </div>
      </main>
    </div>
  )
}