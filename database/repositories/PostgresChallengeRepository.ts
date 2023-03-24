import { Pool } from 'pg';
import { ChallengeRepository } from '@/database/interfaces/ChallengeRepository';
import { Challenge } from '@/database/entities/Challenge';

export class PostgresChallengeRepository implements ChallengeRepository<Challenge> {

  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findAll(): Promise<Challenge[]> {
    const response = await this.db.query(`
        SELECT challenge.id,
               challenge.title,
               challenge.description,
               challenge.created_at,
               json_build_object(
                       'username', user_profile.username,
                       'name', user_profile.name
                   ) as author
        FROM challenge
                 INNER JOIN user_profile on challenge.user_profile_id = user_profile.id
    `);
    return response.rows;
  }

  async findByID(id: string): Promise<Challenge> {
    const response = await this.db.query(`
        SELECT challenge.id,
               challenge.title,
               challenge.description,
               challenge.created_at,
               json_build_object(
                       'username', user_profile.username,
                       'name', user_profile.name
                   ) as author
        FROM challenge
                 INNER JOIN user_profile on challenge.user_profile_id = user_profile.id
        WHERE challenge.id = $1;
    `, [id]);
    return response.rows[0];
  }

  async create(newChallenge: Partial<Challenge>, userId: string): Promise<Challenge> {
    const response = await this.db.query(`
        INSERT INTO challenge (title, description, user_profile_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `, [newChallenge.title, newChallenge.description, userId]);
    return response.rows[0];
  }
}
