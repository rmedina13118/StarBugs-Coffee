import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ConfirmacionPedidoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-muted-foreground">Tu pedido #12345 ha sido creado exitosamente</p>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido:</span>
              <span className="font-medium">#12345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-green-600">$139.73</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Confirmado
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/pedidos/12345" className="block">
              <Button className="w-full bg-transparent" variant="outline">
                Ver Detalle del Pedido
              </Button>
            </Link>
            <Link href="/pedidos" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Volver a Pedidos</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
