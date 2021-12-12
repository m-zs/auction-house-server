import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import { AppModule } from 'app.module';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { HashService } from 'utils/hash/hash.service';
import { createAuthUserWithToken, generateUser, makeRequest } from 'utils/test';

describe('Users - e2e', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let usersResolver: UsersResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersRepository, UsersResolver, UsersService, HashService],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersResolver = module.get<UsersResolver>(UsersResolver);

    await app.init();
  });

  afterAll(async () => {
    await usersRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();

    await app.close();
  });

  describe('findAll', () => {
    it('should return error if invalid pagination if requested', async () => {
      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          {
            users(limit: 999) {
              items {
                id
              }
            }
          }
        `,
      });

      expect(errors[0].extensions.response.statusCode).toBe(400);
      expect(errors.length).toBe(1);
    });

    it('should return users array', async () => {
      const users = Array.from(Array(5), () => generateUser());

      await Promise.all(
        users.map((_, i) => usersResolver.createUser(users[i])),
      );

      const {
        body: { data },
      } = await makeRequest({
        app,
        query: `
          {
            users {
              items {
                id
              }
            }
          }
        `,
      });

      expect(data.users.items.length).toBe(users.length);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      const user = await usersResolver.createUser(generateUser());

      if (!user) {
        throw new Error('User missing');
      }

      const { id } = user;

      const {
        body: { data },
      } = await makeRequest({
        app,
        query: `
          {
            user(id: "${id}") {
              id
            }
          }
        `,
      });

      expect(data.user.id).toBe(id);
    });
  });

  describe('createUser', () => {
    const { username, email, password } = generateUser();
    const createUserRequest = async () =>
      await makeRequest({
        app,
        query: `
          mutation {
            createUser(user: {
              username: "${username}",
              email: "${email}",
              password: "${password}"
            }) {
              id
              username
            }
          }
        `,
      });

    it('should create a new user', async () => {
      const {
        body: { data },
      } = await createUserRequest();

      expect(data.createUser.username).toBe(username);
    });

    it('should return an error for duplicated user', async () => {
      const {
        body: { errors, data },
      } = await createUserRequest();

      expect(errors.length).toBe(1);
      expect(errors[0].extensions.response.statusCode).toBe(409);
      expect(data.createUser).toBe(null);
    });
  });

  describe('updateUser', () => {
    it('should return an error for request without a valid token', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateUser(user: {
              email: "${faker.internet.email()}"
            }) {
              id
            }
          }
        `,
      });

      expect(errors.length).toBe(1);
      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(data.updateUser).toBe(null);
    });

    it('should update existing user', async () => {
      const { token, id } = await createAuthUserWithToken(usersResolver, app);

      const {
        body: {
          data: { updateUser },
        },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateUser(user: {
              email: "${faker.internet.email()}"
            }) {
              id
            }
          }
        `,
        token,
      });

      expect(updateUser.id).toBe(id);
    });
  });

  describe('removeUser', () => {
    it('should return an error for request without a valid token', async () => {
      const {
        body: {
          errors,
          data: { removeUser },
        },
      } = await makeRequest({
        app,
        query: `
          mutation {
            removeUser {
              id
            }
          }
        `,
      });

      expect(errors.length).toBe(1);
      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(removeUser).toBe(null);
    });
  });

  it('should remove existing user', async () => {
    const { token, id } = await createAuthUserWithToken(usersResolver, app);

    const {
      body: {
        data: { removeUser },
      },
    } = await makeRequest({
      app,
      query: `
        mutation {
          removeUser {
            id
          }
        }
      `,
      token,
    });

    const {
      body: {
        data: { user },
      },
    } = await makeRequest({
      app,
      query: `
        {
          user(id: "${id}") {
            id
          }
        }
      `,
    });

    expect(user).toBe(null);
    expect(removeUser.id).toBe(id);
  });
});
