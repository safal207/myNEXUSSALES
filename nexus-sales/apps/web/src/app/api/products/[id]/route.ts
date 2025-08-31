import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../auth/lib/middleware';
import { products } from '../../auth/lib/db';

interface RouteParams {
  params: { id: string };
}

// GET a single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = await verifyAuth(request);
  if (authResult.error) return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });

  const productId = parseInt(params.id, 10);
  const product = products.get(productId);

  if (!product || product.userId !== authResult.user?.id) {
    return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product }, { status: 200 });
}

// PUT (update) a product by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await verifyAuth(request);
  if (authResult.error) return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });

  const productId = parseInt(params.id, 10);
  const existingProduct = products.get(productId);

  if (!existingProduct || existingProduct.userId !== authResult.user?.id) {
    return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
  }

  try {
    const { name, description, price } = await request.json();
    const updatedProduct = { ...existingProduct, name, description, price };
    products.set(productId, updatedProduct);
    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
}

// DELETE a product by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await verifyAuth(request);
  if (authResult.error) return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });

  const productId = parseInt(params.id, 10);
  const product = products.get(productId);

  if (!product || product.userId !== authResult.user?.id) {
    return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
  }

  products.delete(productId);
  return NextResponse.json({ success: true, message: 'Product deleted successfully.' }, { status: 200 });
}
