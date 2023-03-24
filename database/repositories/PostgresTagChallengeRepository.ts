import { Pool } from 'pg';
import { TagChallengeRepository } from '@/database/interfaces/TagChallengeRepository';
import { TagChallenge } from '@/database/entities/TagChallenge';

export class PostgresTagChallengeRepository implements TagChallengeRepository<TagChallenge> {
  private db: Pool;

  constructor(pool: Pool) {
    this.db = pool;
  }

  async create(tagChallengeList: Array<Partial<TagChallenge>>): Promise<void> {
    for (const tagChallenge of tagChallengeList) {
      const { tag_id, challenge_id } = tagChallenge;
      await this.db.query(
        `INSERT INTO tag_challenge (tag_id, challenge_id)
         VALUES ((SELECT id FROM tag WHERE name = $1), $2)
         RETURNING *`,
        [tag_id, challenge_id]
      );
    }
  }
}
