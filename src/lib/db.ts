import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
    host: process.env.DB_HOST || '100.67.197.73',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'moitinhdau',
    database: process.env.DB_NAME || 'pmp_app',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;

// Helper function for queries
export async function query(text: string, params?: unknown[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}

// Get a client from the pool
export async function getClient() {
    const client = await pool.connect();
    const release = client.release.bind(client);

    // Override release to log
    client.release = () => {
        client.release = release;
        return release();
    };

    return client;
}
