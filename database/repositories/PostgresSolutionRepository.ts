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
}
