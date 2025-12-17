import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const detalles = await query(`
      SELECT 
        dp.ID_Detalle,
        dp.ID_Producto,
        dp.Cantidad,
        dp.Precio_Unitario,
        (dp.Cantidad * dp.Precio_Unitario) as subtotal,
        pr.Nombre as producto_nombre,
        pr.Descripcion
      FROM Detalle_Pedido dp
      LEFT JOIN Producto pr ON dp.ID_Producto = pr.ID_Producto
      WHERE dp.ID_Pedido = ?
      ORDER BY dp.ID_Detalle
    `, [id])

    return NextResponse.json({ detalles })
  } catch (error) {
    console.error("Error en consulta:", error)
    return NextResponse.json({ error: "Error al obtener detalles" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pedidoId } = await params
    const body = await request.json()

    if (!body.productoId || !body.cantidad || !body.precioUnitario) {
      return NextResponse.json(
        { error: "productoId, cantidad y precioUnitario son requeridos" }, 
        { status: 400 }
      )
    }

    const cantidadProducto = Number(body.cantidad)
    const productoId = body.productoId

    // Obtener las recetas del producto para descontar insumos
    const recetas: any = await query(
      "SELECT ID_Insumo, Cantidad FROM Receta WHERE ID_Producto = ?",
      [productoId]
    )

    // Verificar stock disponible antes de procesar
    for (const receta of recetas as any[]) {
      const insumoId = receta.ID_Insumo
      const cantidadInsumoPorProducto = Number(receta.Cantidad)
      const cantidadTotalNecesaria = cantidadInsumoPorProducto * cantidadProducto

      // Verificar stock disponible
      const insumo: any = await query(
        "SELECT Stock_Actual FROM Insumo WHERE ID_Insumo = ?",
        [insumoId]
      )

      if (!insumo || (insumo as any[]).length === 0) {
        return NextResponse.json(
          { error: `Insumo con ID ${insumoId} no encontrado` },
          { status: 400 }
        )
      }

      const stockActual = Number((insumo as any[])[0].Stock_Actual)
      if (stockActual < cantidadTotalNecesaria) {
        const nombreInsumo: any = await query(
          "SELECT Nombre FROM Insumo WHERE ID_Insumo = ?",
          [insumoId]
        )
        const nombre = (nombreInsumo as any[])[0]?.Nombre || "desconocido"
        return NextResponse.json(
          { 
            error: `Stock insuficiente de ${nombre}. Disponible: ${stockActual.toFixed(3)}, Necesario: ${cantidadTotalNecesaria.toFixed(3)}` 
          },
          { status: 400 }
        )
      }
    }

    // Insertar el detalle del pedido
    const result = await query(
      "INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario) VALUES (?, ?, ?, ?)",
      [pedidoId, productoId, cantidadProducto, body.precioUnitario]
    )

    // Descontar insumos según las recetas
    for (const receta of recetas as any[]) {
      const insumoId = receta.ID_Insumo
      const cantidadInsumoPorProducto = Number(receta.Cantidad)
      const cantidadTotalNecesaria = cantidadInsumoPorProducto * cantidadProducto

      // Crear movimiento de salida
      await query(
        "INSERT INTO Movimiento_Insumo (ID_Insumo, ID_Pedido, Tipo, Cantidad) VALUES (?, ?, 'Salida', ?)",
        [insumoId, pedidoId, cantidadTotalNecesaria]
      )

      // Actualizar stock del insumo
      await query(
        "UPDATE Insumo SET Stock_Actual = Stock_Actual - ? WHERE ID_Insumo = ?",
        [cantidadTotalNecesaria, insumoId]
      )
    }

    return NextResponse.json({ 
      success: true,
      id: (result as any).insertId,
      message: "Detalle agregado al pedido y insumos descontados"
    }, { status: 201 })
  } catch (error) {
    console.error("Error al insertar:", error)
    return NextResponse.json({ error: "Error al agregar detalle" }, { status: 500 })
  }
}