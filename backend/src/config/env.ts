import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
  throw new Error('Missing JWT configuration: Ensure JWT_SECRET and JWT_EXPIRES_IN are set in the .env file.');
}

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};