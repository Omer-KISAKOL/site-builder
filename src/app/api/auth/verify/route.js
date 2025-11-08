import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Token'ı doğrula
    const decoded = verifyToken(token);

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: decoded.id || decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

