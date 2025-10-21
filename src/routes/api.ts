import { Hono } from 'hono';

const api = new Hono();

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString()
  }
];

api.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

api.get('/users', (c) => {
  return c.json({
    success: true,
    data: users,
    count: users.length
  });
});

api.get('/users/:id', (c) => {
  const id = Number(c.req.param('id'));
  const user = users.find(u => u.id === id);

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

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    return c.json({
      success: true,
      data: newUser
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body'
    }, 400);
  }
});

api.put('/users/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    const body = await c.req.json();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    users[userIndex] = {
      ...users[userIndex],
      name: body.name || users[userIndex].name,
      email: body.email || users[userIndex].email
    };

    return c.json({
      success: true,
      data: users[userIndex]
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body'
    }, 400);
  }
});

api.delete('/users/:id', (c) => {
  const id = Number(c.req.param('id'));
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return c.json({
      success: false,
      error: 'User not found'
    }, 404);
  }

  users.splice(userIndex, 1);

  return c.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default api;
