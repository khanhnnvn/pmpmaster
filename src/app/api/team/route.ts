import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all team members
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let sql = `
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.user_id = u.id) as project_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = u.id) as task_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = u.id AND t.status = 'completed') as completed_tasks
      FROM users u
      WHERE 1=1
    `;

        const params: unknown[] = [];

        if (role) {
            sql += ` AND u.role = $1`;
            params.push(role);
        }

        sql += ` ORDER BY u.created_at DESC`;

        const result = await query(sql, params);

        // Remove password_hash from response
        const users = result.rows.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return NextResponse.json({
            success: true,
            data: users,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch team members' },
            { status: 500 }
        );
    }
}

// POST create new team member
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, full_name, role, position, avatar_url } = body;

        if (!email || !full_name) {
            return NextResponse.json(
                { success: false, error: 'Email and full name are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Default password for new users (should be changed)
        const bcrypt = require('bcryptjs');
        const password_hash = await bcrypt.hash('password123', 10);

        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, role, position, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, role, position, avatar_url, created_at`,
            [email, password_hash, full_name, role || 'user', position || null, avatar_url || null]
        );

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating team member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create team member' },
            { status: 500 }
        );
    }
}
