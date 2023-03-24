import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage } from '@/utils/types';
import { PostgresSolutionRepository } from '@/database/repositories/PostgresSolutionRepository';
import { Solution } from '@/database/entities/Solution';
import db from '@/database';
import validateUUID from "@/utils/validateUUID";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Solution | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const solutionId: string = typeof id === 'string' ? id : '';

  if (!solutionId) return res.status(400).json({ message: 'Missing solution id' });
  if (!validateUUID(solutionId)) return res.status(400).json({ message: 'Invalid solution id' });

  const solutionRepository = new PostgresSolutionRepository(db);
  const solution = await solutionRepository.findById(solutionId);

  if (!solution) return res.status(404).json({ message: 'Solution not found' });

  return res.status(200).json(solution);
}
