import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all tasks
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');
        const status = searchParams.get('status');
        const assigneeId = searchParams.get('assignee_id');
        const limit = searchParams.get('limit') || '50';

        let sql = `
      SELECT 
        t.*,
        p.name as project_name,
        u.full_name as assignee_name,
        u.avatar_url as assignee_avatar
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE 1=1
    `;

        const params: unknown[] = [];
        let paramIndex = 1;

        if (projectId) {
            sql += ` AND t.project_id = $${paramIndex}`;
            params.push(projectId);
            paramIndex++;
        }

        if (status) {
            sql += ` AND t.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (assigneeId) {
            sql += ` AND t.assignee_id = $${paramIndex}`;
            params.push(assigneeId);
            paramIndex++;
        }

        sql += ` ORDER BY t.created_at DESC LIMIT $${paramIndex}`;
        params.push(parseInt(limit));

        const result = await query(sql, params);

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// POST create new task
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, project_id, assignee_id, status, priority, due_date } = body;

        if (!title) {
            return NextResponse.json(
                { success: false, error: 'Task title is required' },
                { status: 400 }
            );
        }

        const result = await query(
            `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [title, description || null, project_id || null, assignee_id || null, status || 'pending', priority || 'medium', due_date || null]
        );

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create task' },
            { status: 500 }
        );
    }
}
