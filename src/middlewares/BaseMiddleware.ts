import * as express from 'express';
import { sendError } from '../services';

export function BaseMiddleware(err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (err) {
    return sendError(err, res);
  }
  return next();
}
