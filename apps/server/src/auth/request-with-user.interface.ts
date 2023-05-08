import { Request } from 'express';

import { User } from '@lavida/core/entities/user.entity';

export interface RequestWithUser extends Request {
  user?: User;
}
