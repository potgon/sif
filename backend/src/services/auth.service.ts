import prisma from '../config/prisma';
import { UserSchema } from '../schemas/user.schema';
import { signJwt } from '../utils/jwt';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const registerUser = async (input: UserSchema) => {
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
    },
  });
};

export const loginUser = async (input: UserSchema) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = signJwt({ userId: user.id });

  return { token };
};