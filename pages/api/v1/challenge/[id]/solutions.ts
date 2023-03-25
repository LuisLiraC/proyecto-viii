import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostgresSolutionRepository } from "@/database/repositories/PostgresSolutionRepository";
import { Solution } from '@/database/entities/Solution';
import { ErrorMessage } from "@/utils/types";
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Solution> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const challengeId: string = typeof id === 'string' ? id : '';

  if (!challengeId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(challengeId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const cacheKey = `CHALLENGE_SOLUTIONS_${challengeId}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedSolutions = await redis.get(cacheKey);

  if (cachedSolutions) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedSolutions));
  }

  const solutionRepository = new PostgresSolutionRepository(postgres);
  const solutions = await solutionRepository.findByChallengeId(challengeId);

  await redis.set(cacheKey, JSON.stringify(solutions), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(solutions);
}
