import { UserRepository } from '../domain/repositories/user-repository';
import { PostgresUserRepository } from './db/postgres/user-repository';
import { TursoUserRepository } from './db/turso/user-repository';

export type DatabaseType = 'postgres' | 'turso';

/**
 * Repository Factory
 *
 * Creates the appropriate repository implementation based on the database type.
 * This allows the application to switch between different databases without
 * changing the business logic.
 */
export class RepositoryFactory {
  private static userRepository: UserRepository | null = null;

  /**
   * Get the database type from environment variable
   */
  static getDatabaseType(): DatabaseType {
    const dbType = process.env.DATABASE_TYPE?.toLowerCase();

    if (dbType === 'turso') {
      return 'turso';
    }

    // Default to PostgreSQL
    return 'postgres';
  }

  /**
   * Create and return the appropriate UserRepository implementation
   */
  static getUserRepository(): UserRepository {
    if (this.userRepository) {
      return this.userRepository;
    }

    const dbType = this.getDatabaseType();

    console.log(`Initializing ${dbType.toUpperCase()} repository`);

    switch (dbType) {
      case 'turso':
        this.userRepository = new TursoUserRepository();
        break;
      case 'postgres':
      default:
        this.userRepository = new PostgresUserRepository();
        break;
    }

    return this.userRepository;
  }

  /**
   * Reset the repository instance (useful for testing)
   */
  static reset(): void {
    this.userRepository = null;
  }
}
