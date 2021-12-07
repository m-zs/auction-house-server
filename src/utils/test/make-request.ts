import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const makeRequest = async (
  app: INestApplication,
  query: string,
  bearer?: string,
) =>
  request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${bearer}`)
    .send({
      query,
    });
