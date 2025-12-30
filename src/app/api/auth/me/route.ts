import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pmp-master-secret-key-change-in-production';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };

        // Get user from database
        const result = await query(
            `SELECT id, email, full_name, role, position, avatar_url, created_at
       FROM users WHERE id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            { success: false, error: 'Token không hợp lệ' },
            { status: 401 }
        );
    }
}
