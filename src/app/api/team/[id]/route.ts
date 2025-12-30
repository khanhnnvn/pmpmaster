import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single team member
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `SELECT 
        u.id, u.email, u.full_name, u.role, u.position, u.avatar_url, u.created_at,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.user_id = u.id) as project_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = u.id) as task_count
      FROM users u
      WHERE u.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Team member not found' },
                { status: 404 }
            );
        }

        // Get assigned projects
        const projects = await query(
            `SELECT p.id, p.name, p.status, pm.role as member_role
       FROM project_members pm
       JOIN projects p ON pm.project_id = p.id
       WHERE pm.user_id = $1`,
            [id]
        );

        // Get assigned tasks
        const tasks = await query(
            `SELECT t.id, t.title, t.status, t.priority, t.due_date, p.name as project_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assignee_id = $1
       ORDER BY t.due_date ASC NULLS LAST
       LIMIT 10`,
            [id]
        );

        return NextResponse.json({
            success: true,
            data: {
                ...result.rows[0],
                projects: projects.rows,
                recent_tasks: tasks.rows
            }
        });
    } catch (error) {
        console.error('Error fetching team member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch team member' },
            { status: 500 }
        );
    }
}

// PUT update team member
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { full_name, role, position, avatar_url } = body;

        const result = await query(
            `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           role = COALESCE($2, role),
           position = COALESCE($3, position),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, full_name, role, position, avatar_url, created_at`,
            [full_name, role, position, avatar_url, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Team member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating team member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update team member' },
            { status: 500 }
        );
    }
}

// DELETE team member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `DELETE FROM users WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Team member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete team member' },
            { status: 500 }
        );
    }
}
