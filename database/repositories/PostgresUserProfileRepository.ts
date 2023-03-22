import { UserProfileRepository } from "@/database/interfaces/UserProfileRepository";
import { Pool } from "pg";
import { UserProfile } from "@/database/entities/UserProfile";

export class PostgresUserProfileRepository implements UserProfileRepository<UserProfile> {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findByUsername(username: string): Promise<UserProfile> {
    const response = await this.db.query(`
        SELECT username
        FROM user_profile
        WHERE username = $1;
    `, [username]);

    return response.rows[0];
  }
}
