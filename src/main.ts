import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { PsqlErrorInterceptor } from './interceptors/psql-error.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalInterceptors(new PsqlErrorInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}

bootstrap();
