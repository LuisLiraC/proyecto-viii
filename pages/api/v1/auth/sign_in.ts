import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import db from '@/database';
import { PostgresAuthUserRepository } from '@/database/repositories/PostgresAuthUserRepository';
import { PostgresUserProfileRepository } from "@/database/repositories/PostgresUserProfileRepository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let { email, password } = req.body;

  email = email?.trim();
  if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' });

  const authUserRepository = new PostgresAuthUserRepository(db);
  const userProfileRepository = new PostgresUserProfileRepository(db);

  const user = await authUserRepository.findByEmail(email);
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!user || !passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const userProfile = await userProfileRepository.findByID(user.id);

  // return jwt
  const token = jsonwebtoken.sign({
    id: userProfile.id,
    role: userProfile.role.name,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return res.status(200).json({ message: 'User logged in', token });

}
