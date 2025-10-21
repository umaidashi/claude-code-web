import { Hono } from 'hono';
import { query } from '../db/connection';

const api = new Hono();

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

api.get('/health', async (c) => {
  try {
    const result = await query('SELECT NOW() as time');
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: result.rows[0].time
    });
  } catch (error) {
    return c.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 503);
  }
});

api.get('/users', async (c) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY id ASC');
    return c.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch users'
    }, 500);
  }
});

api.get('/users/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, 400);
    }

    const result = await query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch user'
    }, 500);
  }
});

api.post('/users', async (c) => {
  try {
    const body = await c.req.json();

    if (!body.name || !body.email) {
      return c.json({
        success: false,
        error: 'Name and email are required'
      }, 400);
    }

    // Check if email already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [body.email]);

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return c.json({
        success: false,
        error: 'Email already exists'
      }, 409);
    }

    const result = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [body.name, body.email]
    );

    return c.json({
      success: true,
      data: result.rows[0]
    }, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({
      success: false,
      error: 'Failed to create user'
    }, 500);
  }
});

api.put('/users/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    const body = await c.req.json();

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, 400);
    }

    // Check if user exists
    const userCheck = await query('SELECT id FROM users WHERE id = $1', [id]);

    if (userCheck.rowCount === 0) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (body.name) {
      updates.push(`name = $${paramCount}`);
      values.push(body.name);
      paramCount++;
    }

    if (body.email) {
      updates.push(`email = $${paramCount}`);
      values.push(body.email);
      paramCount++;
    }

    if (updates.length === 0) {
      return c.json({
        success: false,
        error: 'No fields to update'
      }, 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return c.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({
      success: false,
      error: 'Failed to update user'
    }, 500);
  }
});

api.delete('/users/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, 400);
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'User deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({
      success: false,
      error: 'Failed to delete user'
    }, 500);
  }
});

export default api;
