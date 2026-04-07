import data from './mockData.json'

type TableName = keyof typeof data
const db = data as Record<string, any[]>

// Orden: más específicos primero para evitar falsos matches
const TABLE_MAP: [string, TableName][] = [
  ['Movimiento_Insumo', 'Movimiento_Insumo'],
  ['Detalle_Pedido',    'Detalle_Pedido'],
  ['Proveedor',         'Proveedor'],
  ['Producto',          'Producto'],
  ['PRODUCTO',          'Producto'],
  ['Factura',           'Factura'],
  ['Pedido',            'Pedido'],
  ['Empleado',          'Empleado'],
  ['Cliente',           'Cliente'],
  ['Insumo',            'Insumo'],
  ['Receta',            'Receta'],
  ['Categoria',         'Categoria'],
]

function detectTable(sql: string): TableName | null {
  const fromMatch = sql.match(/FROM\s+(\w+)/i)
  if (fromMatch) {
    const entry = TABLE_MAP.find(([k]) => k === fromMatch[1])
    if (entry) return entry[1]
  }
  for (const [key, table] of TABLE_MAP) {
    if (sql.includes(key)) return table
  }
  return null
}

function getIdField(table: TableName): string {
  const map: Partial<Record<TableName, string>> = {
    Categoria: 'ID_Categoria',
    Cliente: 'ID_Cliente',
    Empleado: 'ID_Empleado',
    Producto: 'ID_Producto',
    Pedido: 'ID_Pedido',
    Factura: 'ID_Factura',
    Insumo: 'ID_Insumo',
    Proveedor: 'ID_Proveedor',
    Receta: 'ID_Receta',
    Movimiento_Insumo: 'ID_Movimiento',
  }
  return map[table] ?? 'id'
}

let nextId: Partial<Record<TableName, number>> = {}

function getNextId(table: TableName): number {
  if (!nextId[table]) {
    const rows = db[table] ?? []
    const idField = getIdField(table)
    nextId[table] = rows.length > 0 ? Math.max(...rows.map((r: any) => r[idField] ?? 0)) + 1 : 1
  }
  return nextId[table]!++
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  const s = sql.trim()

  // SELECT COUNT(*)
  if (/SELECT\s+COUNT\(\*\)/i.test(s)) {
    const table = detectTable(s)
    if (!table) return [{ c: 0 }]
    const idField = getIdField(table)
    const whereMatch = s.match(/WHERE\s+\w+\s*=\s*\?/i)
    if (whereMatch) {
      const col = whereMatch[0].replace(/WHERE\s+/i, '').split(/\s*=\s*/)[0].trim()
      const count = (db[table] ?? []).filter((r: any) => String(r[col]) === String(params[0])).length
      return [{ c: count }]
    }
    return [{ c: (db[table] ?? []).length }]
  }

  // INSERT
  if (/^INSERT/i.test(s)) {
    const table = detectTable(s)
    if (!table) return { insertId: 0, affectedRows: 0 }
    const idField = getIdField(table)
    const id = getNextId(table)
    const colMatch = s.match(/\(([^)]+)\)\s+VALUES/i)
    const newRow: any = { [idField]: id }
    if (colMatch) {
      const cols = colMatch[1].split(',').map((c: string) => c.trim())
      cols.forEach((col: string, i: number) => { newRow[col] = params[i] ?? null })
    }
    db[table].push(newRow)
    return { insertId: id, affectedRows: 1 }
  }

  // UPDATE
  if (/^UPDATE/i.test(s)) {
    const table = detectTable(s)
    if (!table) return { affectedRows: 0 }
    const idField = getIdField(table)
    const setMatch = s.match(/SET\s+(.+?)\s+WHERE/i)
    const whereMatch = s.match(/WHERE\s+\w+\s*=\s*\?/i)
    if (!setMatch || !whereMatch) return { affectedRows: 0 }
    const setCols = setMatch[1].split(',').map((p: string) => p.split('=')[0].trim())
    const idValue = params[params.length - 1]
    const row = (db[table] ?? []).find((r: any) => String(r[idField]) === String(idValue))
    if (row) setCols.forEach((col: string, i: number) => { row[col] = params[i] })
    return { affectedRows: row ? 1 : 0 }
  }

  // DELETE
  if (/^DELETE/i.test(s)) {
    const table = detectTable(s)
    if (!table) return { affectedRows: 0 }
    const idField = getIdField(table)
    const before = db[table].length
    db[table] = db[table].filter((r: any) => String(r[idField]) !== String(params[0]))
    return { affectedRows: before - db[table].length }
  }

  // SELECT — reportes especiales
  if (/Reporte_Ventas_Mensuales|DATE_FORMAT/i.test(s)) return db['Reporte_Ventas_Mensuales'] ?? []
  if (/productos_vendidos|total_vendido/i.test(s)) return db['Reporte_Productos_Vendidos'] ?? []
  if (/Stock_Actual\s*<\s*Stock_Minimo/i.test(s)) {
    return (db['Insumo'] ?? []).filter((r: any) => r.Stock_Actual < r.Stock_Minimo)
  }
  if (/DATE\(p\.Fecha_Hora\)/i.test(s)) return db['Reporte_Ventas'] ?? []

  // SELECT con WHERE id
  const table = detectTable(s)
  if (!table) return []

  const rows: any[] = db[table] ?? []

  if (params.length > 0 && /WHERE/i.test(s)) {
    const idField = getIdField(table)
    // Pedido con JOIN a Detalle_Pedido (lista de pedidos por cliente)
    if (/ID_Cliente\s*=\s*\?/i.test(s) && /Detalle_Pedido/i.test(s)) {
      return rows.filter((r: any) => String(r.ID_Cliente) === String(params[0]))
    }
    return rows.filter((r: any) => String(r[idField]) === String(params[0]))
  }

  return rows
}

export default { execute: async (sql: string, params: any[]) => [await query(sql, params)] }
