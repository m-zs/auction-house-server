import { Request, Response } from 'express';

import { User } from 'src/components/users/entities/user.entity';

export interface GlobalContext {
  req: Request & { user?: User };
  res: Response;
}
