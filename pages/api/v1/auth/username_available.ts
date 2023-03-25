import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorMessage, UserNameAvailability } from "@/utils/types";
import postgres from '@/database/clients/postgres';
import { PostgresUserProfileRepository } from "@/database/repositories/PostgresUserProfileRepository";

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserNameAvailability | ErrorMessage>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const userProfileRepository = new PostgresUserProfileRepository(postgres);
  let { username } = req.body;

  username = username?.trim();

  if (!username || username?.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });

  // verify if username already exists
  const userProfile = await userProfileRepository.findByUsername(username);

  if (userProfile) return res.status(200).json({ is_available: false });

  return res.status(200).json({ is_available: true });
}
