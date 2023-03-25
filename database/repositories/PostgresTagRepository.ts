import { Tag } from '@/database/entities/Tag';
import { TagRepository } from "@/database/interfaces/TagRepository";
import { Pool } from 'pg';

export class PostgresTagRepository implements TagRepository<Tag> {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findAll(): Promise<Tag[]> {
    const { rows } = await this.db.query(`
        SELECT *
        FROM tag`);
    return rows;
  }

  async findByChallengeId(challengeId: string): Promise<Tag[]> {
    const { rows } = await this.db.query(`
        SELECT *
        FROM tag
                 INNER JOIN tag_challenge ON tag_challenge.tag_id = tag.id
        WHERE tag_challenge.challenge_id = $1`, [challengeId]);
    return rows;
  }
}
