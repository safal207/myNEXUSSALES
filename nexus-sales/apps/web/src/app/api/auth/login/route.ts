import { NextResponse } from 'next/server';
import { users } from '../lib/db';
import { SignJWT } from 'jose';

// Function to get the secret key
function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables.');
  }
  return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user in the mock database
    const user = users.get(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // User is authenticated, create JWT
    const { password: _, ...userWithoutPassword } = user;

    const token = await new SignJWT(userWithoutPassword)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h') // Token expires in 2 hours
      .sign(getJwtSecretKey());

    const response = NextResponse.json({
        success: true,
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );

    // It's good practice to set the token in an HttpOnly cookie as well
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 2 // 2 hours
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
