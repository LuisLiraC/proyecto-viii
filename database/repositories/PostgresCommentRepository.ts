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

  async create(newComment: Partial<Comment>, userId: string): Promise<Comment> {
    const response = await this.db.query(
      `INSERT INTO comment (content, solution_id, user_profile_id)
       VALUES ($1, $2, $3)
       RETURNING
           id,
           content,
           created_at,
           (SELECT json_build_object(
                           'username', user_profile.username,
                           'name', user_profile.name
                       )
            FROM user_profile
            WHERE user_profile.id = $3) AS author;
      `, [newComment.content, newComment.solution_id, userId]
    );

    return response.rows[0];
  }
}
