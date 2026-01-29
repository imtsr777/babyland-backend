import { Request, Response, NextFunction } from 'express';
import {TokenNotProvidedError, Token, InvalidTokenError, TokenExpiredError} from 'inhaus_core';
import { sendError } from '../services';

export function CheckClientSessionMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      if (!(req.headers && req.headers.authorization)) {
        throw new TokenNotProvidedError();
      }
      const accessToken = req.headers.authorization.split(' ')[1];
      const payload = new Token(process.env.JWT_SECRET, Number(process.env.JWT_TOKEN_EXPIRE_SECONDS)).buildToken(accessToken).verify();

    } catch (error) {
      if (error.message === 'jwt expired') {
        error = new TokenExpiredError();
      }
      if (error.message === 'invalid signature' || error.message === 'jwt malformed') {
        error = new InvalidTokenError();
      }

      return sendError(error, res);
    }
    await next();
  };
}
