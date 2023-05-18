import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from '@/utils/types';
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresChallengeRepository } from '@/database/repositories/PostgresChallengeRepository';
import { PostgresSolutionRepository } from '@/database/repositories/PostgresSolutionRepository';
import { Challenge } from '@/database/entities/Challenge';
import { Solution } from '@/database/entities/Solution';

type PublicProfile = {
  challenges: Challenge[];
  solutions: Solution[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PublicProfile | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { username } = req.query;
  const profileUsername: string = typeof username === 'string' ? username : '';

  if (!profileUsername) return res.status(400).json({ message: 'Missing username' });

  const cacheKey = `PROFILE_${profileUsername}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedProfile = await redis.get(cacheKey);

  if (cachedProfile) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedProfile));
  }

  const challengeRepository = new PostgresChallengeRepository(postgres);
  const challenges = await challengeRepository.findByUsername(profileUsername);

  const solutionRepository = new PostgresSolutionRepository(postgres);
  const solutions = await solutionRepository.findByUsername(profileUsername);

  const publicProfile = {
    challenges,
    solutions,
  };

  await redis.set(cacheKey, JSON.stringify(publicProfile), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(publicProfile);
}
