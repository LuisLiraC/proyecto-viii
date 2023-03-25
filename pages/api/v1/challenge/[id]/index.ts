import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from '@/utils/types';
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresChallengeRepository } from '@/database/repositories/PostgresChallengeRepository';
import { Challenge } from '@/database/entities/Challenge';
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Challenge | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const challengeId: string = typeof id === 'string' ? id : '';

  if (!challengeId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(challengeId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const cacheKey = `CHALLENGE_${challengeId}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedChallenge = await redis.get(cacheKey);

  if (cachedChallenge) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedChallenge));
  }

  const challengeRepository = new PostgresChallengeRepository(postgres);
  const challenge = await challengeRepository.findById(challengeId);

  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

  await redis.set(cacheKey, JSON.stringify(challenge), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(challenge);
}
