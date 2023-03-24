import db from '@/database';
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

  const tagRepository = new PostgresSolutionRepository(db);
  const tags = await tagRepository.findByChallengeId(challengeId);
  return res.status(200).json(tags);
}
