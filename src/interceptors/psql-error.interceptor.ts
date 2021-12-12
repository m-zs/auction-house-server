import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { DB_ERRORS, getErrorData } from 'utils/errors/psql';

@Injectable()
export class PsqlErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (!error?.code || !error?.detail) {
          throw error;
        }

        const { name, value } = getErrorData(error.detail);

        switch (error.code) {
          case DB_ERRORS.DUPLICATE:
            throw new ConflictException(
              `Value ${value} for ${name} already exists.`,
            );

          case DB_ERRORS.FOREIGN_MISSING:
            throw new BadRequestException(
              `Invalid value ${value} for field ${name}.`,
            );

          default:
            throw error;
        }
      }),
    );
  }
}
