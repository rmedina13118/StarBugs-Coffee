
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, User, Users, Filter, Download } from "lucide-react"

export default function ClientesPage() {
  const clientes = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", telefono: "+1 234 567 8900", pedidos: 15 },
    { id: 2, nombre: "María García", email: "maria@example.com", telefono: "+1 234 567 8901", pedidos: 23 },
    { id: 3, nombre: "Carlos López", email: "carlos@example.com", telefono: "+1 234 567 8902", pedidos: 8 },
    { id: 4, nombre: "Ana Martínez", email: "ana@example.com", telefono: "+1 234 567 8903", pedidos: 31 },
  ]

  const empleados = [
    { id: 1, nombre: "Luis Rodríguez", cargo: "Gerente", email: "luis@example.com", telefono: "+1 234 567 8904" },
    { id: 2, nombre: "Sofia Hernández", cargo: "Vendedor", email: "sofia@example.com", telefono: "+1 234 567 8905" },
    { id: 3, nombre: "Pedro Sánchez", cargo: "Almacenista", email: "pedro@example.com", telefono: "+1 234 567 8906" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Clientes y Empleados</h1>
            <p className="text-muted-foreground">
              Administra la información de clientes y empleados de StarBugs Coffee
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nuevo
            </Button>
          </div>
        </div>
        <Tabs defaultValue="clientes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/50">
            <TabsTrigger value="clientes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="empleados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              Empleados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="mt-6">
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar clientes..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Lista de Clientes
                  <Badge variant="secondary">{clientes.length} clientes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                        <th className="text-left py-3 px-4 font-medium">Pedidos</th>
                        <th className="text-left py-3 px-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente) => (
                        <tr key={cliente.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">{cliente.nombre}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{cliente.email}</td>
                          <td className="py-4 px-4 text-muted-foreground">{cliente.telefono}</td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">{cliente.pedidos} pedidos</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empleados" className="mt-6">
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar empleados..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Lista de Empleados
                  <Badge variant="secondary">{empleados.length} empleados</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Empleado</th>
                        <th className="text-left py-3 px-4 font-medium">Cargo</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                        <th className="text-left py-3 px-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleados.map((empleado) => (
                        <tr key={empleado.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-accent" />
                              </div>
                              <span className="font-medium">{empleado.nombre}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">{empleado.cargo}</Badge>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{empleado.email}</td>
                          <td className="py-4 px-4 text-muted-foreground">{empleado.telefono}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
