/**
 * Database initialization script for PMP Master
 * Run with: node scripts/init-db.js
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '100.67.197.73',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'moitinhdau',
  database: 'postgres', // Connect to default database first
});

const DB_NAME = 'pmp_app';

async function createDatabase() {
  const client = await pool.connect();
  try {
    // Check if database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database: ${DB_NAME}`);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log('Database created successfully!');
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } finally {
    client.release();
  }
}

async function createTables() {
  const appPool = new Pool({
    host: process.env.DB_HOST || '100.67.197.73',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'moitinhdau',
    database: DB_NAME,
  });

  const client = await appPool.connect();
  try {
    console.log('Creating tables...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar_url TEXT,
        position VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created users table');

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        client VARCHAR(255),
        description TEXT,
        progress INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'planning',
        due_date DATE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created projects table');

    // Project members (many-to-many)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (project_id, user_id)
      );
    `);
    console.log('✓ Created project_members table');

    // Tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        assignee_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created tasks table');

    // Meetings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        meeting_date TIMESTAMP NOT NULL,
        duration_minutes INTEGER,
        notes TEXT,
        zoom_link TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created meetings table');

    // Meeting attendees
    await client.query(`
      CREATE TABLE IF NOT EXISTS meeting_attendees (
        meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (meeting_id, user_id)
      );
    `);
    console.log('✓ Created meeting_attendees table');

    // Meeting action items
    await client.query(`
      CREATE TABLE IF NOT EXISTS meeting_actions (
        id SERIAL PRIMARY KEY,
        meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        assignee_id INTEGER REFERENCES users(id),
        linked_task_id INTEGER REFERENCES tasks(id),
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created meeting_actions table');

    console.log('\nAll tables created successfully!');
  } finally {
    client.release();
    await appPool.end();
  }
}

async function main() {
  try {
    await createDatabase();
    await createTables();
    console.log('\n✅ Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
