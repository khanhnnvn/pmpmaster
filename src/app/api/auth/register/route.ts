import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pmp-master-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, full_name, position } = body;

        if (!email || !password || !full_name) {
            return NextResponse.json(
                { success: false, error: 'Email, mật khẩu và họ tên là bắt buộc' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Email đã được sử dụng' },
                { status: 409 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, role, position)
       VALUES ($1, $2, $3, 'user', $4)
       RETURNING id, email, full_name, role, position, avatar_url, created_at`,
            [email, password_hash, full_name, position || null]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            success: true,
            data: {
                user,
                token
            }
        }, { status: 201 });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, error: 'Đã xảy ra lỗi khi đăng ký' },
            { status: 500 }
        );
    }
}
