import { Request, Response, NextFunction } from 'express';
import { LanguageEnum } from '../core';

export async function ModernMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const lang = req.headers['content-language'] ? req.headers['content-language'] : LanguageEnum.UZ;
  req.lang = lang;
  res.lang = lang;
  await next();
}
