import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const results = await query('SELECT * FROM PRODUCTO WHERE ID_Producto = ?', [id]);
    if (Array.isArray(results) && results.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { Nombre, urlImage, Precio, ID_Categoria, Descripcion, Disponibilidad } = await request.json();
    const result = await query(
      'UPDATE PRODUCTO SET Nombre = ?, urlImage = ?, Precio = ?, ID_Categoria = ?, Descripcion = ?, Disponibilidad = ? WHERE ID_Producto = ?',
      [Nombre, urlImage, Precio, ID_Categoria, Descripcion, Disponibilidad, id]
    );
    return NextResponse.json({ message: 'Product updated successfully', result });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM PRODUCTO WHERE ID_Producto = ?', [id]);
    return NextResponse.json({ message: 'Product deleted successfully', result });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}