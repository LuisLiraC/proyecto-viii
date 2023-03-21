import type { NextApiRequest, NextApiResponse } from 'next';
import type { Challenge } from '@/types/Challenge';
import type { ErrorMessage } from '@/types/ErrorMessage';
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Challenge | ErrorMessage>) {
  const queryResponse = await db.query(`
      SELECT challenge.id,
             challenge.title,
             challenge.description,
             challenge.created_at,
             json_build_object(
                     'username', user_profile.username,
                     'name', user_profile.name
                 ) as author
      FROM challenge
               INNER JOIN user_profile on challenge.user_profile_id = user_profile.id
      WHERE challenge.id = $1;
  `, [req.query.id]);

  const challenge: Challenge = queryResponse.rows[0];

  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

  res.status(200).json(challenge);
}
