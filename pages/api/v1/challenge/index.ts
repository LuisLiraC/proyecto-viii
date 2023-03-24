import type { NextApiRequest, NextApiResponse } from 'next';
import type { Challenge } from '@/database/entities/Challenge';
import { PostgresChallengeRepository } from '@/database/repositories/PostgresChallengeRepository';
import { PostgresTagChallengeRepository } from "@/database/repositories/PostgresTagChallengeRepository";
import { ErrorMessage } from "@/utils/types";
import verifyToken from "@/utils/verifyToken";
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Challenge> | Challenge | ErrorMessage>) {
  if (req.method === 'GET') {
    const challengeRepository = new PostgresChallengeRepository(db);
    const challenges = await challengeRepository.findAll();
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

    const challengeRepository = new PostgresChallengeRepository(db);

    const newChallenge: Partial<Challenge> = {
      title,
      description,
    };

    const challenge = await challengeRepository.create(newChallenge, token.id);

    const tagChallengeRepository = new PostgresTagChallengeRepository(db);

    const tagChallengeList = tags.map((tag_id: string) => {
      return { tag_id, challenge_id: challenge.id };
    });

    await tagChallengeRepository.create(tagChallengeList);

    return res.status(201).json(challenge);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
