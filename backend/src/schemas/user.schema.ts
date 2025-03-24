import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserSchema = z.infer<typeof UserSchema>;