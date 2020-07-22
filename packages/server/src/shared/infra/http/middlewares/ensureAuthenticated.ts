import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import authConfig from '@config/auth';

import TokenExpiredError from '@shared/errors/TokenExpiredError';

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void | Error {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing.');
  }

  const [, token] = authHeader.split(' ');

  try {
    jwt.verify(token, authConfig.secret);

    return next();
  } catch {
    throw new TokenExpiredError('Invalid JWT token');
  }
}
