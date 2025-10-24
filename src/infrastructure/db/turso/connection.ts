import { createClient } from '@libsql/client';

// Turso/LibSQL client configuration
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('Turso/LibSQL client initialized');

export default client;
