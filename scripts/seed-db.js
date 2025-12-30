/**
 * Seed database with sample data
 * Run with: node scripts/seed-db.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: process.env.DB_HOST || '100.67.197.73',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'moitinhdau',
    database: 'pmp_app',
});

async function seedUsers(client) {
    console.log('Seeding users...');

    const users = [
        { email: 'alex@pmpmaster.com', password: 'password123', full_name: 'Alex Johnson', role: 'admin', position: 'Trưởng dự án' },
        { email: 'sarah@pmpmaster.com', password: 'password123', full_name: 'Sarah Williams', role: 'user', position: 'Designer' },
        { email: 'mike@pmpmaster.com', password: 'password123', full_name: 'Mike Chen', role: 'user', position: 'Developer' },
        { email: 'emily@pmpmaster.com', password: 'password123', full_name: 'Emily Davis', role: 'user', position: 'QA Engineer' },
        { email: 'david@pmpmaster.com', password: 'password123', full_name: 'David Kim', role: 'user', position: 'Backend Developer' },
    ];

    for (const user of users) {
        const password_hash = await bcrypt.hash(user.password, 10);
        await client.query(
            `INSERT INTO users (email, password_hash, full_name, role, position)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         role = EXCLUDED.role,
         position = EXCLUDED.position`,
            [user.email, password_hash, user.full_name, user.role, user.position]
        );
    }
    console.log(`✓ Seeded ${users.length} users`);
}

async function seedProjects(client) {
    console.log('Seeding projects...');

    const projects = [
        { name: 'Thiết kế lại Website - Q3', client: 'Acme Corp', progress: 45, status: 'in_progress', due_date: '2024-03-31' },
        { name: 'Ra mắt ứng dụng di động', client: 'FinTech Sol.', progress: 15, status: 'planning', due_date: '2024-06-30' },
        { name: 'Kiểm toán Marketing Q2', client: 'Nội bộ', progress: 100, status: 'completed', due_date: '2024-02-28' },
        { name: 'Chuyển đổi Cloud', client: 'Omega Inc', progress: 72, status: 'in_progress', due_date: '2024-04-15' },
        { name: 'Làm mới thương hiệu', client: 'Startup X', progress: 0, status: 'planning', due_date: '2024-05-01' },
    ];

    for (const project of projects) {
        await client.query(
            `INSERT INTO projects (name, client, progress, status, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, 1)
       ON CONFLICT DO NOTHING`,
            [project.name, project.client, project.progress, project.status, project.due_date]
        );
    }
    console.log(`✓ Seeded ${projects.length} projects`);
}

async function seedTasks(client) {
    console.log('Seeding tasks...');

    const tasks = [
        { title: 'Thiết kế Homepage', project_id: 1, assignee_id: 2, status: 'in_progress', priority: 'high', due_date: '2024-01-15' },
        { title: 'Viết API thanh toán', project_id: 1, assignee_id: 3, status: 'in_review', priority: 'urgent', due_date: '2024-01-18' },
        { title: 'Kiểm thử giỏ hàng', project_id: 1, assignee_id: 4, status: 'completed', priority: 'medium', due_date: '2024-01-20' },
        { title: 'Thiết kế UI Dashboard', project_id: 2, assignee_id: 2, status: 'pending', priority: 'high', due_date: '2024-02-01' },
        { title: 'Setup CI/CD Pipeline', project_id: 4, assignee_id: 5, status: 'in_progress', priority: 'medium', due_date: '2024-01-25' },
    ];

    for (const task of tasks) {
        await client.query(
            `INSERT INTO tasks (title, project_id, assignee_id, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
            [task.title, task.project_id, task.assignee_id, task.status, task.priority, task.due_date]
        );
    }
    console.log(`✓ Seeded ${tasks.length} tasks`);
}

async function seedMeetings(client) {
    console.log('Seeding meetings...');

    const meetings = [
        { title: 'Họp tuần - Sprint 4', project_id: 1, meeting_date: '2024-01-25 10:00:00', duration_minutes: 60, notes: 'Đội frontend báo cáo trễ 2 ngày do vấn đề tích hợp API.' },
        { title: 'Đánh giá rủi ro', project_id: 1, meeting_date: '2024-01-19 14:30:00', duration_minutes: 60, notes: 'Phân tích các rủi ro tiềm ẩn khi mở rộng quy mô server.' },
        { title: 'Họp khởi động', project_id: 2, meeting_date: '2024-01-12 09:00:00', duration_minutes: 90, notes: 'Xác định phạm vi dự án và các mốc thời gian quan trọng.' },
    ];

    for (const meeting of meetings) {
        await client.query(
            `INSERT INTO meetings (title, project_id, meeting_date, duration_minutes, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, 1)
       ON CONFLICT DO NOTHING`,
            [meeting.title, meeting.project_id, meeting.meeting_date, meeting.duration_minutes, meeting.notes]
        );
    }
    console.log(`✓ Seeded ${meetings.length} meetings`);
}

async function main() {
    const client = await pool.connect();
    try {
        await seedUsers(client);
        await seedProjects(client);
        await seedTasks(client);
        await seedMeetings(client);

        console.log('\n✅ Database seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
