import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { userId, admin, position } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    // Build update query dynamically based on what's provided
    const updates = [];
    const values = [];

    if (admin !== undefined) {
      updates.push('admin = ?');
      values.push(admin ? 'admin' : null);
    }

    if (position !== undefined) {
      updates.push('position = ?');
      values.push(position);
    }

    if (updates.length === 0) {
      connection.release();
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(userId);

    const query = `UPDATE phos_person SET ${updates.join(', ')} WHERE phos_id = ?`;
    
    const [result] = await connection.query(query, values);
    
    connection.release();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
