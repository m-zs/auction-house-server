import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

const IgnoredPropertyName = Symbol('transform-interceptor');

// add this interceptor to ignore global TransformInterceptor
export const TransformInterceptorIgnore =
  () =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.value[IgnoredPropertyName] = true;
  };

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    // check if unique ignore property exists
    // if true skip transformation
    if (context.getHandler()[IgnoredPropertyName]) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}
