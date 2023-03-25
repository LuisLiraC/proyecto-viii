import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from '@/utils/types';
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresSolutionRepository } from '@/database/repositories/PostgresSolutionRepository';
import { Solution } from '@/database/entities/Solution';
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Solution | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const solutionId: string = typeof id === 'string' ? id : '';

  if (!solutionId) return res.status(400).json({ message: 'Missing solution id' });
  if (!validateUUID(solutionId)) return res.status(400).json({ message: 'Invalid solution id' });

  const cacheKey = `SOLUTION_${solutionId}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedSolution = await redis.get(cacheKey);

  if (cachedSolution) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedSolution));
  }

  const solutionRepository = new PostgresSolutionRepository(postgres);
  const solution = await solutionRepository.findById(solutionId);

  if (!solution) return res.status(404).json({ message: 'Solution not found' });

  await redis.set(cacheKey, JSON.stringify(solution), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(solution);
}
