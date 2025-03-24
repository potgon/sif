import jwt, {Secret} from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET: Secret = env.jwtSecret;
const JWT_EXPIRES_IN: number = parseInt(env.jwtExpiresIn);

if (!JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new Error('Missing JWT configuration: Ensure JWT_SECRET and JWT_EXPIRES_IN are set.');
}

export const signJwt = (payload: { userId: string }) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyJwt = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};