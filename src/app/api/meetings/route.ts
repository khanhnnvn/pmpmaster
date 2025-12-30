import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all meetings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        let sql = `
      SELECT 
        m.*,
        p.name as project_name,
        u.full_name as created_by_name,
        (SELECT COUNT(*) FROM meeting_attendees ma WHERE ma.meeting_id = m.id) as attendee_count,
        (SELECT COUNT(*) FROM meeting_actions act WHERE act.meeting_id = m.id) as action_count
      FROM meetings m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.created_by = u.id
      WHERE 1=1
    `;

        const params: unknown[] = [];

        if (projectId) {
            sql += ` AND m.project_id = $1`;
            params.push(projectId);
        }

        sql += ` ORDER BY m.meeting_date DESC`;

        const result = await query(sql, params);

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch meetings' },
            { status: 500 }
        );
    }
}

// POST create new meeting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, project_id, meeting_date, duration_minutes, notes, zoom_link, created_by, attendee_ids } = body;

        if (!title || !meeting_date) {
            return NextResponse.json(
                { success: false, error: 'Title and meeting date are required' },
                { status: 400 }
            );
        }

        // Create meeting
        const result = await query(
            `INSERT INTO meetings (title, project_id, meeting_date, duration_minutes, notes, zoom_link, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [title, project_id || null, meeting_date, duration_minutes || 60, notes || null, zoom_link || null, created_by || 1]
        );

        const meeting = result.rows[0];

        // Add attendees if provided
        if (attendee_ids && attendee_ids.length > 0) {
            for (const userId of attendee_ids) {
                await query(
                    `INSERT INTO meeting_attendees (meeting_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                    [meeting.id, userId]
                );
            }
        }

        return NextResponse.json({
            success: true,
            data: meeting
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating meeting:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create meeting' },
            { status: 500 }
        );
    }
}
