import { Request, Response } from 'express';

import { User } from 'components/users/entities/user.entity';

export interface GlobalContext {
  req: Request & { user?: User };
  res: Response;
}
