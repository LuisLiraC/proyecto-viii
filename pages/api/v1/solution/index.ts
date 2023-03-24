import type { NextApiRequest, NextApiResponse } from 'next';
import postgres from '@/database/clients/postgres';
import { PostgresSolutionRepository } from '@/database/repositories/PostgresSolutionRepository';
import { Solution } from '@/database/entities/Solution';
import type { ErrorMessage } from '@/utils/types';
import validateUUID from "@/utils/validateUUID";
import verifyToken from "@/utils/verifyToken";
import validateUrl from "@/utils/validateUrl";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Solution | ErrorMessage>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let { url, challenge_id, description } = req.body;

  url = url?.trim();
  challenge_id = challenge_id?.trim();
  description = description?.trim();

  if (!url || !challenge_id || !description) return res.status(400).json({ message: 'Missing fields' });
  if (!validateUUID(challenge_id)) return res.status(400).json({ message: 'Invalid challenge id' });
  if (url.length > 255) return res.status(400).json({ message: 'URL is too long' });
  if (description.length > 1000) return res.status(400).json({ message: 'Description is too long' });
  if (!validateUrl(url)) return res.status(400).json({ message: 'Invalid URL' });

  const token = verifyToken(req);

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const solutionRepository = new PostgresSolutionRepository(postgres);

  const userAlreadySubmittedSolution = await solutionRepository.verifyUserAlreadySubmittedSolution(challenge_id, token.id);

  if (userAlreadySubmittedSolution) return res.status(400).json({ message: 'You already submitted a solution for this challenge' });

  const newSolution: Partial<Solution> = {
    url,
    challenge_id,
    description
  };

  const solution = await solutionRepository.create(newSolution, token.id);

  if (!solution) return res.status(404).json({ message: 'Solution not found' });

  return res.status(200).json(solution);
}
