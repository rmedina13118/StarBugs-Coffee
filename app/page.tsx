"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Warehouse, Coffee, ArrowRight, TrendingUp, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function HomePage() {

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/granos-cafe.jpg"
            alt="Coffee background"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/30 border-0 p-2"
          >
            {mounted && theme === "dark" ? 
              <Sun className="h-7 w-7 text-white text-2xl" /> : 
              <Moon className="h-7 w-7 text-white text-2xl" />
            }
          </Button>
        <div className="relative container mx-auto px-4 py-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative p-4 rounded-3xl overflow-hidden mb-8">
              <div className="absolute inset-0 " />
              <div className="flex justify-center">
                <div className="flex w-40 items-center justify-center rounded-2xl">
                  <img src="/logo.jpeg" alt="StarBugs Logo" className=" rounded-full w-full" />
                </div>
              </div>
            </div>
            <p className="text-white/80 mb-8 max-w-lg mx-auto text-xl">
              Administrador de cafetería con un sistema eficiente y completo.
              Control total de pedidos, inventario, productos y más.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Acceder al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Módulos del Sistema</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Accede rápidamente a todas las funcionalidades de gestión de tu cafetería
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xl font-bold">Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Métricas en tiempo real, ventas del día y estado general del negocio
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pedidos" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="px-2 py-1 bg-primary/10 rounded-full">
                    <span className="text-xs font-medium text-primary">24 activos</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestión completa de pedidos, estados y seguimiento en tiempo real
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/productos" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Administra tu menú completo, precios y disponibilidad
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/inventario" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Warehouse className="h-6 w-6 text-primary" />
                  </div>
                  <div className="px-2 py-1 bg-destructive/10 rounded-full">
                    <span className="text-xs font-medium text-destructive">7 bajos</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Control de stock, alertas de inventario bajo y movimientos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reportes" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Análisis de ventas, tendencias y reportes detallados
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clientes" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">Clientes y Empleados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestión de clientes, empleados e historial de compras
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}
