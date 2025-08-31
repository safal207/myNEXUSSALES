import { NextRequest, NextResponse } from 'next/server';
import { products, orders } from '../../auth/lib/db';

// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_COUNT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_COUNT) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  try {
    const { productId, email, name } = await request.json();

    if (!productId || !email) {
      return NextResponse.json({ success: false, message: 'Product ID and email are required.' }, { status: 400 });
    }

    // Ensure productId is handled as a number for map lookup
    const numericProductId = parseInt(productId, 10);
    if (isNaN(numericProductId)) {
      return NextResponse.json({ success: false, message: 'Invalid Product ID.' }, { status: 400 });
    }

    const product = products.get(numericProductId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    const newId = orders.size + 1;
    const newOrder = {
      id: `ord_${newId}_${Date.now()}`,
      productId,
      email,
      name: name || null,
      status: 'created',
      createdAt: new Date().toISOString(),
      amount: product.price,
    };

    orders.set(newId, newOrder);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
}
