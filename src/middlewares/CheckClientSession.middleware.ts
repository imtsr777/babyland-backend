import { Request, Response, NextFunction } from 'express';
import { sendError } from '../services';

export function CheckClientSessionMiddleware(isTokenRequired = true) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if( !isTokenRequired && !(req.headers && req.headers.authorization)){
        req.client = null;
        return next();
      }

    } catch (error) {
      return sendError(error, res);
    }
    await next();
  };
}
