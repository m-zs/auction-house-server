import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const makeRequest = async ({
  app,
  query,
  token,
  cookies,
}: {
  app: INestApplication;
  query: string;
  token?: string;
  cookies?: string[];
}) =>
  request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .set('Cookie', cookies || [])
    .send({
      query,
    });
