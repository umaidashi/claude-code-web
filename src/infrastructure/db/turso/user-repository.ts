import { UserRepository } from '../../../domain/repositories/user-repository';
import { User, CreateUserInput, UpdateUserInput } from '../../../domain/entities/user';
import client from './connection';

export class TursoUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const result = await client.execute('SELECT * FROM users ORDER BY id ASC');
    return result.rows as unknown as User[];
  }

  async findById(id: number): Promise<User | null> {
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id],
    });
    return (result.rows[0] as unknown as User) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });
    return (result.rows[0] as unknown as User) || null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await client.execute({
      sql: `INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now')) RETURNING *`,
      args: [data.name, data.email],
    });
    return result.rows[0] as unknown as User;
  }

  async update(id: number, data: UpdateUserInput): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = datetime('now')`);
    values.push(id);

    const result = await client.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ? RETURNING *`,
      args: values,
    });

    return (result.rows[0] as unknown as User) || null;
  }

  async delete(id: number): Promise<User | null> {
    const result = await client.execute({
      sql: 'DELETE FROM users WHERE id = ? RETURNING *',
      args: [id],
    });
    return (result.rows[0] as unknown as User) || null;
  }

  async healthCheck(): Promise<{ connected: boolean; timestamp: Date }> {
    try {
      const result = await client.execute(`SELECT datetime('now') as time`);
      return {
        connected: true,
        timestamp: new Date(result.rows[0].time as string),
      };
    } catch (error) {
      return {
        connected: false,
        timestamp: new Date(),
      };
    }
  }
}
