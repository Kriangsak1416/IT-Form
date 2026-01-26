import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Role mapping: treat ADMIN_ROLE_ID (default 1) as admin permission in user_roles
    const adminRoleRaw = parseInt(process.env.ADMIN_ROLE_ID || '1', 10);
    const adminRoleId = Number.isNaN(adminRoleRaw) ? 1 : adminRoleRaw;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        phos_id as id,
        phos_username_pid,
        phos_password_year,
        phos_firstname,
        phos_lastname,
        position,
        EXISTS(
          SELECT 1 FROM user_roles ur
          WHERE ur.user_id = phos_id AND ur.role_id = ?
        ) AS is_admin
      FROM phos_person
      WHERE phos_username_pid = ?`,
      [adminRoleId, username]
    );
    connection.release();

    const users = rows as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.phos_password_year !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.phos_username_pid,
        firstname: user.phos_firstname,
        lastname: user.phos_lastname,
        position: user.position,
        isAdmin: Boolean(user.is_admin),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
