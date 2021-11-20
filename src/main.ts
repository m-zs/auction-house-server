import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PsqlErrorInterceptor } from './interceptors/psql-error.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new PsqlErrorInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}

bootstrap();
