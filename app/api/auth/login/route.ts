import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT phos_id as id, phos_username_pid, phos_password_year FROM phos_person WHERE phos_username_pid = ?',
      [username]
    );
    connection.release();

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = (rows as any)[0];
    const isPasswordValid = await comparePassword(password, user.phos_password_year);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);

    const response = NextResponse.json(
      { message: 'Login successful', userId: user.id },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
