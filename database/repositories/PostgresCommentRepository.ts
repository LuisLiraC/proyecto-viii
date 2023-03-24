import { Pool } from "pg";
import { CommentRepository } from "@/database/interfaces/CommentRepository";
import { Comment } from "@/database/entities/Comment";

export class PostgresCommentRepository implements CommentRepository<Comment> {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findBySolutionId(solutionId: string): Promise<Comment[]> {
    const response = await this.db.query(
      `SELECT comment.id,
              comment.content,
              comment.created_at,
              json_build_object(
                      'username', user_profile.username,
                      'name', user_profile.name
                  ) AS author
       FROM comment
                INNER JOIN user_profile ON comment.user_profile_id = user_profile.id
       WHERE solution_id = $1`,
      [solutionId]
    );

    return response.rows;
  }
}
