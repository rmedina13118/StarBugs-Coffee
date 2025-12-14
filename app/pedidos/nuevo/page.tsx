import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Plus, Minus } from "lucide-react"
import Link from "next/link"

export default function NuevoPedidoPage() {
  const productos = [
    { id: 1, nombre: "Producto A", imagen: "/generic-product-display.png", precio: 25.99 },
    { id: 2, nombre: "Producto B", imagen: "/generic-product-display.png", precio: 35.5 },
    { id: 3, nombre: "Producto C", imagen: "/generic-product-display.png", precio: 15.75 },
    { id: 4, nombre: "Producto D", imagen: "/generic-product-display.png", precio: 45.0 },
    { id: 5, nombre: "Producto E", imagen: "/generic-product-display.png", precio: 28.99 },
    { id: 6, nombre: "Producto F", imagen: "/generic-product-display.png", precio: 19.99 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/pedidos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Creación de Nuevo Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" placeholder="Nombre del cliente" />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" type="tel" placeholder="Número de teléfono" />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección de Entrega</Label>
                <Input id="direccion" placeholder="Dirección completa" />
              </div>
            </CardContent>
          </Card>

          {/* Resumen del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-primary">$5.00</span>
                </div>
                <Link href="/pedidos/12345/confirmacion">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                    Crear Pedido
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selección de productos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Seleccionar Productos</CardTitle>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar productos..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productos.map((producto) => (
                <Card key={producto.id} className="overflow-hidden">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{producto.nombre}</h3>
                    <p className="text-lg font-bold text-primary mb-3">${producto.precio.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input type="number" defaultValue="0" className="h-8 w-16 text-center" />
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
