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
                   )                                             as author,
               (SELECT json_agg(
                               json_build_object(
                                       'id', tag.id,
                                       'name', tag.name
                                   )
                           )
                FROM tag
                         INNER JOIN tag_challenge ON tag.id = tag_challenge.tag_id
                WHERE tag_challenge.challenge_id = challenge.id) as tags
        FROM challenge
                 INNER JOIN user_profile on challenge.user_profile_id = user_profile.id
    `);
    return response.rows;
  }

  async findById(id: string): Promise<Challenge> {
    const response = await this.db.query(`
        SELECT challenge.id,
               challenge.title,
               challenge.description,
               challenge.created_at,
               json_build_object(
                       'username', user_profile.username,
                       'name', user_profile.name
                   )                                             as author,
               (SELECT json_agg(
                               json_build_object(
                                       'id', tag.id,
                                       'name', tag.name
                                   )
                           )
                FROM tag
                         INNER JOIN tag_challenge ON tag.id = tag_challenge.tag_id
                WHERE tag_challenge.challenge_id = challenge.id) as tags
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

  async findByUsername(username: string): Promise<Challenge[]> {
    const response = await this.db.query(`
        SELECT challenge.id,
                challenge.title,
                challenge.description,
                challenge.created_at,
                (SELECT json_agg(
                                json_build_object(
                                        'id', tag.id,
                                        'name', tag.name
                                    )
                            )
                  FROM tag
                          INNER JOIN tag_challenge ON tag.id = tag_challenge.tag_id
                  WHERE tag_challenge.challenge_id = challenge.id) as tags
                FROM challenge
                INNER JOIN user_profile on challenge.user_profile_id = user_profile.id
                WHERE user_profile.username = $1;
    `, [username]);
    return response.rows;
  }
}
