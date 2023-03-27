import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { JwtPayload } from "@/utils/types";

export default function verifyToken(req: NextApiRequest): JwtPayload | null {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
