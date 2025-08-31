import { NextResponse } from 'next/server';
import { users } from '../lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Invalid input. Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    if (users.has(email)) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: users.size + 1,
      email,
      password, // In a real app, this would be a hash
    };
    users.set(email, newUser);

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
