import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from '@/utils/types';
import { PostgresChallengeRepository } from '@/database/repositories/PostgresChallengeRepository';
import { Challenge } from '@/database/entities/Challenge';
import postgres from '@/database/clients/postgres';
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Challenge | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const challengeId: string = typeof id === 'string' ? id : '';

  if (!challengeId) return res.status(400).json({ message: 'Missing challenge id' });
  if (!validateUUID(challengeId)) return res.status(400).json({ message: 'Invalid challenge id' });

  const challengeRepository = new PostgresChallengeRepository(postgres);
  const challenge = await challengeRepository.findById(challengeId);

  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

  return res.status(200).json(challenge);
}
