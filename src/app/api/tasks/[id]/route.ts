import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single task
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `SELECT 
        t.*,
        p.name as project_name,
        u.full_name as assignee_name,
        u.avatar_url as assignee_avatar,
        u.email as assignee_email
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch task' },
            { status: 500 }
        );
    }
}

// PUT update task
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, project_id, assignee_id, status, priority, due_date } = body;

        const result = await query(
            `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           project_id = COALESCE($3, project_id),
           assignee_id = COALESCE($4, assignee_id),
           status = COALESCE($5, status),
           priority = COALESCE($6, priority),
           due_date = COALESCE($7, due_date),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
            [title, description, project_id, assignee_id, status, priority, due_date, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `DELETE FROM tasks WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}
