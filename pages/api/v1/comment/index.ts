import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from "@/utils/types";
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresCommentRepository } from '@/database/repositories/PostgresCommentRepository';
import { Comment } from '@/database/entities/Comment';
import verifyToken from "@/utils/verifyToken";
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Comment | ErrorMessage>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let { solution_id, content } = req.body;

  solution_id = solution_id?.trim();
  content = content?.trim();

  if (!solution_id || !content) return res.status(400).json({ message: 'Missing fields' });
  if (!validateUUID(solution_id)) return res.status(400).json({ message: 'Invalid solution id' });
  if (content.length > 500) return res.status(400).json({ message: 'Comment too long' });

  const token = verifyToken(req);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const newComment: Partial<Comment> = {
    solution_id,
    content,
  };

  const commentRepository = new PostgresCommentRepository(postgres);
  const comment = await commentRepository.create(newComment, token.id);

  await redis.del(`SOLUTION_COMMENTS_${solution_id}`);
  
  return res.status(200).json(comment);
}
