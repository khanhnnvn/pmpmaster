import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single meeting with details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `SELECT 
        m.*,
        p.name as project_name,
        u.full_name as created_by_name
      FROM meetings m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.created_by = u.id
      WHERE m.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Meeting not found' },
                { status: 404 }
            );
        }

        // Get attendees
        const attendees = await query(
            `SELECT u.id, u.full_name, u.email, u.avatar_url, u.position
       FROM meeting_attendees ma
       JOIN users u ON ma.user_id = u.id
       WHERE ma.meeting_id = $1`,
            [id]
        );

        // Get action items
        const actions = await query(
            `SELECT 
        ma.*,
        u.full_name as assignee_name,
        t.title as linked_task_title
       FROM meeting_actions ma
       LEFT JOIN users u ON ma.assignee_id = u.id
       LEFT JOIN tasks t ON ma.linked_task_id = t.id
       WHERE ma.meeting_id = $1
       ORDER BY ma.created_at ASC`,
            [id]
        );

        return NextResponse.json({
            success: true,
            data: {
                ...result.rows[0],
                attendees: attendees.rows,
                actions: actions.rows
            }
        });
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch meeting' },
            { status: 500 }
        );
    }
}

// PUT update meeting
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, meeting_date, duration_minutes, notes, zoom_link } = body;

        const result = await query(
            `UPDATE meetings 
       SET title = COALESCE($1, title),
           meeting_date = COALESCE($2, meeting_date),
           duration_minutes = COALESCE($3, duration_minutes),
           notes = COALESCE($4, notes),
           zoom_link = COALESCE($5, zoom_link)
       WHERE id = $6
       RETURNING *`,
            [title, meeting_date, duration_minutes, notes, zoom_link, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Meeting not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating meeting:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update meeting' },
            { status: 500 }
        );
    }
}

// DELETE meeting
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const result = await query(
            `DELETE FROM meetings WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Meeting not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete meeting' },
            { status: 500 }
        );
    }
}
