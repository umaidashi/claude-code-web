import { Hono } from 'hono';
import { RepositoryFactory } from '../infrastructure/repository-factory';

const api = new Hono();

// Get the repository instance (implementation is determined by DATABASE_TYPE env var)
const userRepository = RepositoryFactory.getUserRepository();

api.get('/health', async (c) => {
  try {
    const health = await userRepository.healthCheck();

    if (!health.connected) {
      return c.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      }, 503);
    }

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: health.timestamp,
      db_type: RepositoryFactory.getDatabaseType(),
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
    const users = await userRepository.findAll();
    return c.json({
      success: true,
      data: users,
      count: users.length
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

    const user = await userRepository.findById(id);

    if (!user) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: user
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
    const existingUser = await userRepository.findByEmail(body.email);

    if (existingUser) {
      return c.json({
        success: false,
        error: 'Email already exists'
      }, 409);
    }

    const user = await userRepository.create({
      name: body.name,
      email: body.email,
    });

    return c.json({
      success: true,
      data: user
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
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    // Check if no fields to update
    if (!body.name && !body.email) {
      return c.json({
        success: false,
        error: 'No fields to update'
      }, 400);
    }

    const updatedUser = await userRepository.update(id, {
      name: body.name,
      email: body.email,
    });

    return c.json({
      success: true,
      data: updatedUser
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

    const deletedUser = await userRepository.delete(id);

    if (!deletedUser) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
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
