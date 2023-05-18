import type { NextApiRequest, NextApiResponse } from 'next';
import type { Challenge } from '@/database/entities/Challenge';
import type { ErrorMessage } from "@/utils/types";
import postgres from '@/database/clients/postgres';
import redis from "@/database/clients/redis";
import { PostgresChallengeRepository } from '@/database/repositories/PostgresChallengeRepository';
import { PostgresTagChallengeRepository } from "@/database/repositories/PostgresTagChallengeRepository";
import verifyToken from "@/utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Challenge> | Challenge | ErrorMessage>) {
  const cacheKey = 'CHALLENGES';
  const cacheTTL = 60 * 60 * 24; // 24 hours

  if (req.method === 'GET') {
    const cachedChallenges = await redis.get(cacheKey);

    if (cachedChallenges) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(JSON.parse(cachedChallenges));
    }

    const challengeRepository = new PostgresChallengeRepository(postgres);
    const challenges = await challengeRepository.findAll();

    await redis.set(cacheKey, JSON.stringify(challenges), { ex: cacheTTL });

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(challenges);
  }

  if (req.method === 'POST') {
    let { title, description, tags } = req.body;
    title = title?.trim();
    description = description?.trim();

    if (!title || !description || !tags) return res.status(400).json({ message: 'Missing fields' });
    if (tags.length < 1) return res.status(400).json({ message: 'Missing tags' });

    const token = verifyToken(req);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const challengeRepository = new PostgresChallengeRepository(postgres);

    const newChallenge: Partial<Challenge> = {
      title,
      description,
    };

    const challenge = await challengeRepository.create(newChallenge, token.id);

    const tagChallengeRepository = new PostgresTagChallengeRepository(postgres);

    const tagChallengeList = tags.map((tag_id: string) => {
      return { tag_id, challenge_id: challenge.id };
    });

    await tagChallengeRepository.create(tagChallengeList);

    await redis.del(cacheKey);
    await redis.del(`PROFILE_${token.username}`);

    return res.status(201).json(challenge);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
