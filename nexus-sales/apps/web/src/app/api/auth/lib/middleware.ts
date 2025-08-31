import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables.');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { error: 'Missing authentication token', status: 401 };
  }

  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return { user: verified.payload, status: 200 };
  } catch (err) {
    return { error: 'Invalid token', status: 401 };
  }
}
