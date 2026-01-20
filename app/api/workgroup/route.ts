import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim() || '';
  const hasQuery = search.length > 0;

  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
        SELECT
          phos_wg_id,
          title,
          name,
          lname,
          phos_wg_name_position,
          telephone
        FROM phos_workgroup
        WHERE active = 'Y'
          ${hasQuery ? 'AND (name LIKE ? OR lname LIKE ?)' : ''}
        ORDER BY lname ASC, name ASC
        LIMIT 25
      `,
      hasQuery ? [`%${search}%`, `%${search}%`] : []
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('workgroup GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch workgroup data' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
