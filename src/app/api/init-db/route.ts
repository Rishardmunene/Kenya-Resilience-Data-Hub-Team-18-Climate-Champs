import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kcrd_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request: NextRequest) {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          organization VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create admin user
    const adminEmail = 'admin@kcrd.ke';
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    if (existingAdmin.rows.length === 0) {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123456', saltRounds);

      await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role, organization) VALUES ($1, $2, $3, $4, $5, $6)',
        [adminEmail, passwordHash, 'Admin', 'User', 'admin', 'KCRD']
      );
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      adminUser: {
        email: 'admin@kcrd.ke',
        password: 'admin123456'
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Database initialization failed' },
      { status: 500 }
    );
  }
}
