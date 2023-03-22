import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { email, password } = req.body;

    email = email?.trim();

    if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' });


    const authUsers = await db.query(`
        SELECT *
        FROM auth_user
        WHERE email = $1;
    `, [email]);

    const user = authUsers.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const userProfile = await db.query(`
        SELECT id, name, username, (select name from role where id = user_profile.role_id) as role
        FROM user_profile
        WHERE auth_user_id = $1;
    `, [user.id]);

    // return jwt
    const token = jsonwebtoken.sign({
      id: userProfile.rows[0].id,
      role: userProfile.rows[0].role,
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'User logged in', token });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
