import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};