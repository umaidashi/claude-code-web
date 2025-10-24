import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db',
});

async function init() {
  try {
    // Create table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    console.log('✅ Created users table');

    // Insert sample data
    await client.execute(`
      INSERT OR IGNORE INTO users (id, name, email) VALUES
        (1, 'John Doe', 'john@example.com')
    `);

    await client.execute(`
      INSERT OR IGNORE INTO users (id, name, email) VALUES
        (2, 'Jane Smith', 'jane@example.com')
    `);
    console.log('✅ Inserted sample data');

    // Create index
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('✅ Created index on email');

    // Verify
    const result = await client.execute('SELECT * FROM users');
    console.log(`✅ Turso database initialized successfully! Found ${result.rows.length} users`);

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

init();
