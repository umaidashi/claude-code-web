import { User, CreateUserInput, UpdateUserInput } from '../entities/user';

/**
 * User Repository Interface
 *
 * This interface defines the contract for user data access.
 * Any database implementation (PostgreSQL, Turso, etc.) must implement this interface.
 * This ensures the application core is independent of database implementation details.
 */
export interface UserRepository {
  /**
   * Find all users
   */
  findAll(): Promise<User[]>;

  /**
   * Find a user by ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(data: CreateUserInput): Promise<User>;

  /**
   * Update a user by ID
   */
  update(id: number, data: UpdateUserInput): Promise<User | null>;

  /**
   * Delete a user by ID
   */
  delete(id: number): Promise<User | null>;

  /**
   * Check database connectivity
   */
  healthCheck(): Promise<{ connected: boolean; timestamp: Date }>;
}
