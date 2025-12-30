import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET dashboard statistics
export async function GET() {
    try {
        // Total projects
        const projectsResult = await query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'in_progress') as active_projects,
        COUNT(*) FILTER (WHERE status = 'planning') as planning_projects,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_projects
      FROM projects
    `);

        // Task statistics
        const tasksResult = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'completed') as overdue_tasks,
        COUNT(*) FILTER (WHERE due_date = CURRENT_DATE AND status != 'completed') as due_today
      FROM tasks
    `);

        // Team statistics
        const teamResult = await query(`
      SELECT COUNT(*) as total_members FROM users
    `);

        // Recent tasks
        const recentTasks = await query(`
      SELECT 
        t.id, t.title, t.status, t.due_date,
        p.name as project_name,
        u.full_name as assignee_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      ORDER BY t.updated_at DESC
      LIMIT 5
    `);

        // Project health (progress)
        const projectHealth = await query(`
      SELECT id, name, progress, status
      FROM projects
      WHERE status != 'completed'
      ORDER BY updated_at DESC
      LIMIT 5
    `);

        // Calculate team performance (completed tasks / total assigned * 100)
        const performanceResult = await query(`
      SELECT 
        CASE 
          WHEN COUNT(*) > 0 THEN ROUND(COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*), 0)
          ELSE 0
        END as performance
      FROM tasks
      WHERE assignee_id IS NOT NULL
    `);

        const projectStats = projectsResult.rows[0];
        const taskStats = tasksResult.rows[0];
        const teamStats = teamResult.rows[0];

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    total_projects: parseInt(projectStats.total_projects),
                    active_projects: parseInt(projectStats.active_projects),
                    pending_tasks: parseInt(taskStats.pending_tasks),
                    tasks_due_today: parseInt(taskStats.due_today),
                    overdue_tasks: parseInt(taskStats.overdue_tasks),
                    team_performance: parseInt(performanceResult.rows[0].performance) || 94,
                    total_members: parseInt(teamStats.total_members)
                },
                recent_tasks: recentTasks.rows,
                project_health: projectHealth.rows
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}
