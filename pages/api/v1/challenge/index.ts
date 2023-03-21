import type { NextApiRequest, NextApiResponse } from 'next';
import type { Challenge } from '@/types/Challenge';
import db from '@/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Array<Challenge>>) {
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
               INNER JOIN user_profile on challenge.user_profile_id = user_profile.id`);
  const challenges: Array<Challenge> = queryResponse.rows;

  const list: Array<Challenge> = challenges.map(challenge => {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      created_at: challenge.created_at,
      author: {
        username: challenge.author.username,
        name: challenge.author.name,
      }
    };
  });

  res.status(200).json(list);
}
