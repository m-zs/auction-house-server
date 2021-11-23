import { Request, Response } from 'express';

export interface GlobalContext {
  req: Request;
  res: Response;
}
