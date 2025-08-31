import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../auth/lib/middleware';
import { products } from '../auth/lib/db';

// GET all products for the authenticated user
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (authResult.error) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });
  }

  const userId = authResult.user?.id;
  const userProducts = Array.from(products.values()).filter(p => p.userId === userId);

  return NextResponse.json({ success: true, products: userProducts }, { status: 200 });
}

// POST a new product for the authenticated user
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (authResult.error) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });
  }

  try {
    const { name, description, price } = await request.json();
    const userId = authResult.user?.id;

    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price are required.' }, { status: 400 });
    }

    const newId = products.size + 1;
    const newProduct = {
      id: newId,
      userId,
      name,
      description,
      price,
    };

    products.set(newId, newProduct);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
}
