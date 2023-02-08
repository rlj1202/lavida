import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  // HttpException,
  // HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationError } from 'class-validator';
// import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly validationPipe = new ValidationPipe();

  catch(exception: any, host: ArgumentsHost) {
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    // const httpStatus =
    //   exception instanceof HttpException
    //     ? exception.getStatus()
    //     : HttpStatus.INTERNAL_SERVER_ERROR;

    // const responseBody = {
    //   statusCode: httpStatus,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // };

    // response.status(httpStatus).json(responseBody);

    if (
      exception instanceof Array &&
      exception.every((e) => e instanceof ValidationError)
    ) {
      // Guards are executed before the any pipes or interceptors.
      // Mocking behaviour of ValidationPipe to handle exceptions comes from guards.
      exception = this.validationPipe['exceptionFactory'](exception);
    } else if (exception instanceof EntityNotFoundError) {
      exception = new NotFoundException();
    }

    super.catch(exception, host);
  }
}
