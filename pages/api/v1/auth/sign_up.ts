import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import postgres from '@/database/clients/postgres';
import { PostgresAuthUserRepository } from '@/database/repositories/PostgresAuthUserRepository';
import { PostgresUserProfileRepository } from "@/database/repositories/PostgresUserProfileRepository";
import { AuthUser } from "@/database/entities/AuthUser";
import { UserProfile } from "@/database/entities/UserProfile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let { email, password, name, username }: { email: string } = req.body;

  email = email?.trim();
  name = name?.trim();
  username = username?.trim().replace(/\s/g, '');

  if (!password || password?.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (!username || username?.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });
  if (!name || name?.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });

  const authUserRepository = new PostgresAuthUserRepository(postgres);
  // verify if email already exists
  const user = await authUserRepository.findByEmail(email);

  if (user) return res.status(400).json({ message: 'Email already exists' });

  const userProfileRepository = new PostgresUserProfileRepository(postgres);
  // verify if username already exists
  const usernameExists = await userProfileRepository.findByUsername(username);

  if (usernameExists) return res.status(400).json({ message: 'Username already exists' });

  // hash password
  const hashedPassword: string = await bcrypt.hash(password, 10);

  // create user
  const authUser: Partial<AuthUser> = {
    email,
    password: hashedPassword,
  };

  const newAuthUser = await authUserRepository.create(authUser);

  const userProfile: Partial<UserProfile> = {
    name,
    username,
    auth_user_id: newAuthUser.id,
  };
  // create user profile
  const newUserProfile = await userProfileRepository.create(userProfile);

  // return jwt
  const token = jsonwebtoken.sign({
    username: newUserProfile.username,
    id: newUserProfile.id,
    role: newUserProfile.role.name,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return res.status(201).json({ message: 'User created', token });

}
