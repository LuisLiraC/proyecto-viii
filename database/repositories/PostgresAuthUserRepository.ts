import { AuthUserRepository } from "@/database/interfaces/AuthUserRepository";
import { Pool } from "pg";
import { AuthUser } from "@/database/entities/AuthUser";

export class PostgresAuthUserRepository implements AuthUserRepository<AuthUser> {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<AuthUser> {
    const response = await this.db.query(`
        SELECT *
        FROM auth_user
        WHERE email = $1;
    `, [email]);

    return response.rows[0];
  }
}
