import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { email, password, name, username } = req.body;

    email = email?.trim();
    name = name?.trim();
    username = username?.trim().replace(/\s/g, '');

    // verify if email already exists
    const authUsers = await db.query(`
        SELECT *
        FROM auth_user
        WHERE email = $1;
    `, [email]);

    const user = authUsers.rows[0];

    if (user) return res.status(400).json({ message: 'Email already exists' });
    if (!password || password?.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (!username || username?.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });
    if (!name || name?.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });

    // verify if username already exists
    const userNameExists = await db.query(`
        SELECT username
        FROM user_profile
        WHERE username = $1;
    `, [username]);

    if (userNameExists.rows[0]) return res.status(400).json({ message: 'Username already exists' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const createdAuthUser = await db.query(`
        INSERT INTO auth_user (email, password)
        VALUES ($1, $2)
        RETURNING id
    `, [email, hashedPassword]);

    const userId = createdAuthUser.rows[0].id;

    // create user profile
    const createdUserProfile = await db.query(`
        INSERT INTO user_profile (name, username, auth_user_id, role_id)
        VALUES ($1, $2, $3, (select id from role where name = 'member'))
        RETURNING id, name, username, (select name from role where id = user_profile.role_id) as role;
    `, [name, username, userId]);

    // return jwt
    const token = jsonwebtoken.sign({
      id: createdUserProfile.rows[0].id,
      role: createdUserProfile.rows[0].role,
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({ message: 'User created', token });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
