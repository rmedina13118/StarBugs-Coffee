"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Search, Plus, Minus, UserPlus } from "lucide-react"
import Link from "next/link"

export default function NuevoPedidoPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [empleados, setEmpleados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCliente, setSelectedCliente] = useState("")
  const [selectedEmpleado, setSelectedEmpleado] = useState("")
  const [carrito, setCarrito] = useState<{[key: number]: number}>({})
  const [createClienteDialogOpen, setCreateClienteDialogOpen] = useState(false)
  const [createClienteForm, setCreateClienteForm] = useState({ nombre: "", email: "", telefono: "" })

  useEffect(() => {
    Promise.all([
      fetch("/api/productos").then(res => res.json()),
      fetch("/api/clientes").then(res => res.json()),
      fetch("/api/empleados").then(res => res.json())
    ]).then(([productosData, clientesData, empleadosData]) => {
      if (Array.isArray(productosData)) {
        setProductos(productosData.filter((p: any) => p.Disponibilidad !== false))
      }
      if (clientesData.clientes) {
        setClientes(clientesData.clientes)
      }
      if (empleadosData.ok && empleadosData.empleados) {
        setEmpleados(empleadosData.empleados)
      }
      setLoading(false)
    }).catch(err => {
      console.error("Error cargando datos:", err)
      setLoading(false)
    })
  }, [])

  const productosFiltrados = productos.filter((p) =>
    (p.Nombre || p.nombre)?.toLowerCase().includes(search.toLowerCase())
  )

  const agregarAlCarrito = (productoId: number) => {
    setCarrito(prev => ({
      ...prev,
      [productoId]: (prev[productoId] || 0) + 1
    }))
  }

  const quitarDelCarrito = (productoId: number) => {
    setCarrito(prev => {
      const nuevo = { ...prev }
      if (nuevo[productoId] > 1) {
        nuevo[productoId] -= 1
      } else {
        delete nuevo[productoId]
      }
      return nuevo
    })
  }

  const calcularTotal = () => {
    return Object.entries(carrito).reduce((total, [productoId, cantidad]) => {
      const producto = productos.find(p => (p.ID_Producto || p.id) === Number(productoId))
      const precio = Number(producto?.Precio || producto?.precio || 0)
      return total + (precio * cantidad)
    }, 0)
  }

  const handleCreateCliente = async () => {
    if (!createClienteForm.nombre.trim()) {
      alert("El nombre es requerido")
      return
    }

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: createClienteForm.nombre,
          email: createClienteForm.email || null,
          telefono: createClienteForm.telefono || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Recargar clientes
        const clientesRes = await fetch("/api/clientes")
        const clientesData = await clientesRes.json()
        if (clientesData.clientes) {
          setClientes(clientesData.clientes)
          // Seleccionar el nuevo cliente
          setSelectedCliente(String(data.id))
        }
        setCreateClienteDialogOpen(false)
        setCreateClienteForm({ nombre: "", email: "", telefono: "" })
      } else {
        alert(data.error || "Error al crear el cliente")
      }
    } catch (err) {
      console.error("Error creando cliente:", err)
      alert("Error al crear el cliente")
    }
  }

  if (loading) {
    return <div className="p-6">Cargando...</div>
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
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCreateClienteDialogOpen(true)}
                    className="h-7 text-xs"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Nuevo Cliente
                  </Button>
                </div>
                <select
                  id="cliente"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e.target.value)}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.ID_Cliente || c.id} value={c.ID_Cliente || c.id}>
                      {c.Nombre || c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="empleado">Empleado</Label>
                <select
                  id="empleado"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedEmpleado}
                  onChange={(e) => setSelectedEmpleado(e.target.value)}
                >
                  <option value="">Seleccionar empleado</option>
                  {empleados.map((e) => (
                    <option key={e.ID_Empleado || e.id} value={e.ID_Empleado || e.id}>
                      {e.Nombre || e.nombre} - {e.Puesto || e.puesto}
                    </option>
                  ))}
                </select>
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(carrito).map(([productoId, cantidad]) => {
                    const producto = productos.find(p => (p.ID_Producto || p.id) === Number(productoId))
                    const precio = Number(producto?.Precio || producto?.precio || 0)
                    return (
                      <div key={productoId} className="flex justify-between text-sm">
                        <span>{producto?.Nombre || producto?.nombre} x{cantidad}</span>
                        <span>${(precio * cantidad).toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-primary">${calcularTotal().toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-shadow font-semibold" 
                  size="lg"
                  disabled={!selectedCliente || !selectedEmpleado || Object.keys(carrito).length === 0}
                  onClick={async () => {
                    try {
                      // Crear pedido
                      const pedidoRes = await fetch("/api/pedidos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          clienteId: selectedCliente,
                          empleadoId: selectedEmpleado
                        })
                      })
                      const pedidoData = await pedidoRes.json()
                      const pedidoId = pedidoData.result?.insertId || pedidoData.id

                      // Agregar detalles del pedido
                      for (const [productoId, cantidad] of Object.entries(carrito)) {
                        const producto = productos.find(p => (p.ID_Producto || p.id) === Number(productoId))
                        const precio = Number(producto?.Precio || producto?.precio || 0)
                        const detalleRes = await fetch(`/api/pedidos/${pedidoId}/detalles`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            productoId: productoId,
                            cantidad: cantidad,
                            precioUnitario: precio
                          })
                        })

                        if (!detalleRes.ok) {
                          const errorData = await detalleRes.json()
                          alert(errorData.error || "Error al agregar producto al pedido")
                          return
                        }
                      }

                      window.location.href = `/pedidos/${pedidoId}/confirmacion`
                    } catch (err) {
                      console.error("Error creando pedido:", err)
                      alert("Error al crear el pedido. Verifique que haya suficiente stock de los insumos necesarios.")
                    }
                  }}
                >
                  Crear Pedido
                </Button>
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
                <Input 
                  placeholder="Buscar productos..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay productos disponibles
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productosFiltrados.map((producto) => {
                  const productoId = producto.ID_Producto || producto.id
                  const cantidad = carrito[productoId] || 0
                  const precio = Number(producto.Precio || producto.precio || 0)
                  
                  return (
                    <Card key={productoId} className="overflow-hidden">
                      <div className="aspect-square relative bg-muted">
                        <img
                          src="/generic-product-display.png"
                          alt={producto.Nombre || producto.nombre}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{producto.Nombre || producto.nombre}</h3>
                        <p className="text-lg font-bold text-primary mb-3">${precio.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 bg-transparent"
                            onClick={() => quitarDelCarrito(productoId)}
                            disabled={cantidad === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input 
                            type="number" 
                            value={cantidad} 
                            readOnly
                            className="h-8 w-16 text-center" 
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 bg-transparent"
                            onClick={() => agregarAlCarrito(productoId)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog de crear cliente */}
      <Dialog open={createClienteDialogOpen} onOpenChange={setCreateClienteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="new-cliente-nombre">Nombre *</Label>
              <Input
                id="new-cliente-nombre"
                value={createClienteForm.nombre}
                onChange={(e) => setCreateClienteForm({ ...createClienteForm, nombre: e.target.value })}
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div>
              <Label htmlFor="new-cliente-email">Email</Label>
              <Input
                id="new-cliente-email"
                type="email"
                value={createClienteForm.email}
                onChange={(e) => setCreateClienteForm({ ...createClienteForm, email: e.target.value })}
                placeholder="Email del cliente (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="new-cliente-telefono">Teléfono</Label>
              <Input
                id="new-cliente-telefono"
                type="tel"
                value={createClienteForm.telefono}
                onChange={(e) => setCreateClienteForm({ ...createClienteForm, telefono: e.target.value })}
                placeholder="Teléfono del cliente (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateClienteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCliente}>
              Crear Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
