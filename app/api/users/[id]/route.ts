import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { userId, admin, position } = await request.json();

    const adminRoleRaw = parseInt(process.env.ADMIN_ROLE_ID || '1', 10);
    const adminRoleId = Number.isNaN(adminRoleRaw) ? 1 : adminRoleRaw;

    if (admin === undefined && position === undefined) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update position if provided
      if (position !== undefined) {
        await connection.query(
          'UPDATE phos_person SET position = ? WHERE phos_id = ?',
          [position, userId]
        );
      }

      // Sync admin role via user_roles table
      if (admin !== undefined) {
        if (admin) {
          await connection.query(
            'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [userId, adminRoleId]
          );
        } else {
          await connection.query(
            'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
            [userId, adminRoleId]
          );
        }
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

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
