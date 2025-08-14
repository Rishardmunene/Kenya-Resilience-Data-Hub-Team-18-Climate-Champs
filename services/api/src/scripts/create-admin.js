const bcrypt = require('bcryptjs');
const { query } = require('../utils/database');
require('dotenv').config();

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');

    const adminData = {
      email: 'admin@kcrd.ke',
      password: 'admin123456',
      firstName: 'System',
      lastName: 'Administrator',
      organization: 'KCRD Team',
      role: 'admin'
    };

    // Check if admin already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [adminData.email]);
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, organization, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, organization, created_at`,
      [adminData.email, passwordHash, adminData.firstName, adminData.lastName, adminData.organization, adminData.role]
    );

    const user = result.rows[0];

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Name:', `${user.first_name} ${user.last_name}`);
    console.log('🏢 Organization:', user.organization);
    console.log('🔐 Role:', user.role);
    console.log('🆔 User ID:', user.id);
    console.log('📅 Created:', user.created_at);

    console.log('\n🚀 You can now login with these credentials!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser().then(() => {
  console.log('\n✨ Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
