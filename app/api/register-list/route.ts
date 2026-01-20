import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
        SELECT 
          regist_name,
          regist_list
        FROM phos_register_list
        WHERE regist_is_use = 1
          AND regist_closed_date IS NULL
        ORDER BY regist_list ASC
      `
    );
    conn.release();

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('register-list GET error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch register list' },
      { status: 500 }
    );
  }
}
