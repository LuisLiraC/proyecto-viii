import db from '@/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostgresCommentRepository } from "@/database/repositories/PostgresCommentRepository";
import { Comment } from '@/database/entities/Comment';
import { ErrorMessage } from "@/utils/types";
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Comment> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const solutionId: string = typeof id === 'string' ? id : '';

  if (!solutionId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(solutionId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const commentRepository = new PostgresCommentRepository(db);
  const comments = await commentRepository.findBySolutionId(solutionId);
  return res.status(200).json(comments);
}
