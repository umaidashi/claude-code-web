import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import apiRoutes from './routes/api';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Hono API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users'
    }
  });
});

app.route('/api', apiRoutes);

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
