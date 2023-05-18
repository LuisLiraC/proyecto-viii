import { Pool } from "pg";
import { SolutionRepository } from "@/database/interfaces/SolutionRepository";
import { Solution } from "@/database/entities/Solution";

export class PostgresSolutionRepository implements SolutionRepository {
  private db: Pool;

  constructor(pool: Pool) {
    this.db = pool;
  }

  async findByChallengeId(challengeId: string): Promise<Solution[]> {
    const response = await this.db.query(
      `SELECT solution.id,
              solution.description,
              solution.url,
              solution.created_at,
              json_build_object(
                      'username', user_profile.username,
                      'name', user_profile.name
                  ) as author
       FROM solution
                INNER JOIN user_profile on solution.user_profile_id = user_profile.id
       WHERE challenge_id = $1`,
      [challengeId]
    );

    return response.rows;
  }

  async findById(id: string): Promise<Solution> {
    const response = await this.db.query(
      `SELECT solution.id,
              solution.description,
              solution.url,
              solution.created_at,
              json_build_object(
                      'username', user_profile.username,
                      'name', user_profile.name
                  ) as author
       FROM solution
                INNER JOIN user_profile on solution.user_profile_id = user_profile.id
       WHERE solution.id = $1`,
      [id]
    );

    return response.rows[0];
  }

  async findByUsername(username: string): Promise<Solution[]> {
    const response = await this.db.query(
      `SELECT solution.id,
              solution.description,
              solution.url,
              solution.created_at
       FROM solution
                INNER JOIN user_profile on solution.user_profile_id = user_profile.id
       WHERE user_profile.username = $1`,
      [username]
    );

    return response.rows;
  }

  async create(newSolution: Partial<Solution>, userId: string): Promise<Solution> {
    const response = await this.db.query(
      `
          INSERT INTO solution (description, url, challenge_id, user_profile_id)
          VALUES ($1, $2, $3, $4)
          RETURNING id`,
      [newSolution.description, newSolution.url, newSolution.challenge_id, userId]
    );

    return response.rows[0];
  }

  async verifyUserAlreadySubmittedSolution(challengeId: string, userId: string): Promise<boolean> {
    const response = await this.db.query(
      `SELECT id
       FROM solution
       WHERE challenge_id = $1
         AND user_profile_id = $2`,
      [challengeId, userId]
    );

    return response.rowCount > 0;
  }
}
