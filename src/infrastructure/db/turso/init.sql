-- Initialize Turso/LibSQL database schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert sample data
INSERT OR IGNORE INTO users (id, name, email) VALUES
    (1, 'John Doe', 'john@example.com'),
    (2, 'Jane Smith', 'jane@example.com');

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
