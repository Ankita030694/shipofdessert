import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields (First Name, Email, Password).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
      email: emailNormalized,
      password: hashedPassword,
      role: 'customer',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        data: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration API error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
