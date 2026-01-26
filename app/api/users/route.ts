import { NextRequest, NextResponse } from 'next/server';
import md5 from 'md5';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const adminRoleRaw = parseInt(process.env.ADMIN_ROLE_ID || '1', 10);
    const adminRoleId = Number.isNaN(adminRoleRaw) ? 1 : adminRoleRaw;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        p.phos_id as id,
        p.phos_username_pid as username,
        p.phos_firstname as firstname,
        p.phos_lastname as lastname,
        p.position,
        CASE WHEN ur.role_id IS NOT NULL THEN 'admin' ELSE NULL END AS admin
      FROM phos_person p
      LEFT JOIN user_roles ur ON ur.user_id = p.phos_id AND ur.role_id = ?
      ORDER BY p.phos_firstname`,
      [adminRoleId]
    );
    connection.release();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const adminRoleRaw = parseInt(process.env.ADMIN_ROLE_ID || '1', 10);
  const adminRoleId = Number.isNaN(adminRoleRaw) ? 1 : adminRoleRaw;

  try {
    const { username, password, firstname, lastname, position, admin } = await request.json();

    if (!username || !password || !firstname || !lastname) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const hashedPassword = md5(password);

      const [result]: any = await connection.query(
        'INSERT INTO phos_person (phos_username_pid, phos_password_year, phos_firstname, phos_lastname, position) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, firstname, lastname, position || null]
      );

      const userId = result.insertId;

      if (admin) {
        await connection.query(
          'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [userId, adminRoleId]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'สร้างผู้ใช้เรียบร้อย',
        data: { id: userId },
      });
    } catch (err: any) {
      await connection.rollback();

      if (err?.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'ชื่อผู้ใช้ซ้ำในระบบ' },
          { status: 409 }
        );
      }

      console.error('Error creating user:', err);
      return NextResponse.json(
        { error: 'สร้างผู้ใช้ไม่สำเร็จ' },
        { status: 500 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
