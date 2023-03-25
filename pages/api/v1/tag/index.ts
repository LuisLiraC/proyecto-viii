import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from "@/utils/types";
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresTagRepository } from "@/database/repositories/PostgresTagRepository";
import { Tag } from '@/database/entities/Tag';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Tag> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const cacheKey = `TAGS`;
  const cacheTTL = 60 * 60 * 24; // 24 hours

  const cachedTags = await redis.get(cacheKey);

  if (cachedTags) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(JSON.parse(cachedTags));
  }

  const tagRepository = new PostgresTagRepository(postgres);
  const tags = await tagRepository.findAll();

  await redis.set(cacheKey, JSON.stringify(tags), { ex: cacheTTL });

  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(tags);
}
