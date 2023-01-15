import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const LOG_CONTEXT = 'Logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      `${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`,
      LOG_CONTEXT,
    );
    next();
  }
}
