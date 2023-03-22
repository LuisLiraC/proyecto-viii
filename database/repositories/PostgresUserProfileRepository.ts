import { UserProfileRepository } from "@/database/interfaces/UserProfileRepository";
import { Pool } from "pg";
import { UserProfile } from "@/database/entities/UserProfile";
import db from "@/database";

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

  async findByID(id: string): Promise<UserProfile> {
    const response = await db.query(`
        SELECT user_profile.id,
               user_profile.name,
               username,
               json_build_object(
                       'id', role.id,
                       'name', role.name
                   ) AS role
        FROM user_profile
                 INNER JOIN role ON user_profile.role_id = role.id
        WHERE auth_user_id = $1;
    `, [id]);

    return response.rows[0];
  }
}
