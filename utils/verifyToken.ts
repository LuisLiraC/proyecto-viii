import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { JwtPayload } from "@/utils/types";

// Verifica si el token JWT es válido y devuelve el token decodificado.
export default function verifyToken(req: NextApiRequest): JwtPayload | null {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
