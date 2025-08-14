import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create users table
    await sql`
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
    `;

    const adminEmail = 'admin@kcrd.ke';
    const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    if (existingAdmin.length === 0) {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123456', saltRounds);

      await sql`
        INSERT INTO users (email, password_hash, first_name, last_name, role, organization) 
        VALUES (${adminEmail}, ${passwordHash}, 'Admin', 'User', 'admin', 'KCRD')
      `;
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
