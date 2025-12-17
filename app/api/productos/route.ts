import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const results = await query(`
      SELECT 
        p.ID_Producto,
        p.Nombre,
        p.Precio,
        p.ID_Categoria,
        p.Descripcion,
        p.Disponibilidad,
        c.Nombre as Categoria_Nombre,
        c.Descripcion as Categoria_Descripcion
      FROM Producto p
      LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
      ORDER BY p.Nombre
    `);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { Nombre, Precio, ID_Categoria, Descripcion, Disponibilidad } = await request.json();
    
    if (!Nombre || !Precio || !ID_Categoria) {
      return NextResponse.json({ error: 'Nombre, Precio e ID_Categoria son requeridos' }, { status: 400 });
    }
    
    const result = await query(
      'INSERT INTO Producto (Nombre, Precio, ID_Categoria, Descripcion, Disponibilidad) VALUES (?, ?, ?, ?, ?)',
      [Nombre, Precio, ID_Categoria, Descripcion || null, Disponibilidad !== undefined ? Disponibilidad : true]
    );
    return NextResponse.json({ message: 'Product created successfully', result });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}