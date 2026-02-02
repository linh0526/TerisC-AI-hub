import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Server misconfiguration: ADMIN_PASSWORD not set' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // Create response with success message
      const response = NextResponse.json({ success: true });

      // Set HttpOnly cookie for security
      // In Next.js App Router, cookies().set() is for server actions or middleware mainly,
      // but in route handlers we set it on the response object.
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Mật khẩu không chính xác' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
