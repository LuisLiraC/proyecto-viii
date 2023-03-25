import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from "@/utils/types";
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresCommentRepository } from "@/database/repositories/PostgresCommentRepository";
import { Comment } from '@/database/entities/Comment';
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Comment> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const solutionId: string = typeof id === 'string' ? id : '';

  if (!solutionId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(solutionId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const cacheKey = `COMMENTS_${solutionId}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedComments = await redis.get(cacheKey);

  if (cachedComments) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedComments));
  }

  const commentRepository = new PostgresCommentRepository(postgres);
  const comments = await commentRepository.findBySolutionId(solutionId);

  await redis.set(cacheKey, JSON.stringify(comments), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(comments);
}
