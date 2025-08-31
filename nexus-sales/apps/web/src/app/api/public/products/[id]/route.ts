import { NextRequest, NextResponse } from 'next/server';
import { products } from '../../../auth/lib/db';

interface RouteParams {
  params: { id: string };
}

// GET a single product by ID for public viewing
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const productId = parseInt(params.id, 10);
    const product = products.get(productId);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    // We can choose to only return certain fields to the public
    const publicProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price
    };

    return NextResponse.json({ success: true, product: publicProduct }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
  }
}
