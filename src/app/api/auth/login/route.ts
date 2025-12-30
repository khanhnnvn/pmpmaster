import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pmp-master-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email và mật khẩu là bắt buộc' },
                { status: 400 }
            );
        }

        // Find user by email
        const result = await query(
            `SELECT id, email, password_hash, full_name, role, position, avatar_url 
       FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            );
        }

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

        // Remove password_hash from response
        const { password_hash, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token
            }
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' },
            { status: 500 }
        );
    }
}
