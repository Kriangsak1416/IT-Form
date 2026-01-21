import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT phos_id as id, phos_username_pid as username, phos_firstname as firstname, phos_lastname as lastname, position, admin FROM phos_person ORDER BY phos_firstname'
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
