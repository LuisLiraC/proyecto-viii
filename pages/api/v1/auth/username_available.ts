import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { username } = req.body;

    username = username?.trim();

    if (!username || username?.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });

    // verify if username already exists
    const userNameExists = await db.query(`
        SELECT username
        FROM user_profile
        WHERE username = $1;
    `, [username]);

    if (userNameExists.rows[0]) return res.status(200).json({ is_available: false });

    return res.status(200).json({ is_available: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
