import { UserRepository } from '../../../domain/repositories/user-repository';
import { User, CreateUserInput, UpdateUserInput } from '../../../domain/entities/user';
import { query } from './connection';

export class PostgresUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY id ASC');
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateUserInput): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }

    if (data.email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(data.email);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<User | null> {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  async healthCheck(): Promise<{ connected: boolean; timestamp: Date }> {
    try {
      const result = await query('SELECT NOW() as time');
      return {
        connected: true,
        timestamp: result.rows[0].time,
      };
    } catch (error) {
      return {
        connected: false,
        timestamp: new Date(),
      };
    }
  }
}
