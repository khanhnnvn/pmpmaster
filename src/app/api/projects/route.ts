import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all projects
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = searchParams.get('limit') || '50';

        let sql = `
      SELECT 
        p.*,
        u.full_name as created_by_name,
        COUNT(DISTINCT pm.user_id) as member_count,
        COUNT(DISTINCT t.id) as task_count
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
    `;

        const params: unknown[] = [];

        if (status) {
            sql += ` WHERE p.status = $1`;
            params.push(status);
        }

        sql += ` GROUP BY p.id, u.full_name ORDER BY p.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await query(sql, params);

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, client, description, status, due_date, created_by } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Project name is required' },
                { status: 400 }
            );
        }

        const result = await query(
            `INSERT INTO projects (name, client, description, status, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [name, client || null, description || null, status || 'planning', due_date || null, created_by || 1]
        );

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
