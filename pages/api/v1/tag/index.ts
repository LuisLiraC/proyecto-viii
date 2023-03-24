import postgres from '@/database/clients/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostgresTagRepository } from "@/database/repositories/PostgresTagRepository";
import { Tag } from '@/database/entities/Tag';
import { ErrorMessage } from "@/utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Tag> | ErrorMessage>) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const tagRepository = new PostgresTagRepository(postgres);
  const tags = await tagRepository.findAll();
  return res.status(200).json(tags);
}
