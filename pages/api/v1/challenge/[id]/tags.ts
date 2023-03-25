import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostgresTagRepository } from "@/database/repositories/PostgresTagRepository";
import { Tag } from '@/database/entities/Tag';
import { ErrorMessage } from "@/utils/types";
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Tag> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const challengeId: string = typeof id === 'string' ? id : '';

  if (!challengeId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(challengeId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const cacheKey = `TAGS_${challengeId}`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedTags = await redis.get(cacheKey);

  if (cachedTags) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedTags));
  }

  const tagRepository = new PostgresTagRepository(postgres);
  const tags = await tagRepository.findByChallengeId(challengeId);

  await redis.set(cacheKey, JSON.stringify(tags), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(tags);
}
