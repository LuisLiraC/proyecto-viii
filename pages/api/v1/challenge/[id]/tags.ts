import db from '@/database';
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

  const tagRepository = new PostgresTagRepository(db);
  const tags = await tagRepository.findByChallengeId(challengeId);
  return res.status(200).json(tags);
}
