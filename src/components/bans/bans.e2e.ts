import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import { AppModule } from 'app.module';
import {
  AuthUserWithToken,
  clearDB,
  createAuthUserWithToken,
  createDbUser,
  makeRequest,
} from 'utils/test';
import { BansRepository } from './bans.repository';
import { BansResolver } from './bans.resolver';
import { BansService } from './bans.service';
import { USER_ROLE } from 'components/users/user.types';
import { UsersResolver } from 'components/users/users.resolver';
import { UsersService } from 'components/users/users.service';
import { UsersRepository } from 'components/users/users.repository';
import { HashService } from 'utils/hash/hash.service';
import { User } from 'components/users/entities/user.entity';

describe('Bans - e2e', () => {
  let app: INestApplication;
  let usersResolver: UsersResolver;
  let bansResolver: BansResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UsersRepository,
        UsersResolver,
        UsersService,
        HashService,
        BansResolver,
        BansService,
        BansRepository,
      ],
    }).compile();

    app = module.createNestApplication();
    usersResolver = module.get<UsersResolver>(UsersResolver);
    bansResolver = module.get<BansResolver>(BansResolver);

    await app.init();
  });

  afterAll(async () => {
    await clearDB();
    await app.close();
  });

  describe('findAll', () => {
    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          {
            bans(limit: 1) {
              items {
                id
              }
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
    });

    it('should return bans array', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);
      const admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });

      const bans = Array.from(Array(5), () => ({
        reason: faker.random.words(5),
        endsAt: faker.date.future().toDateString(),
        userId: regularUser.user.id,
      }));

      await Promise.all(
        bans.map((ban) => bansResolver.createBan(ban, admin.user as User)),
      );

      const {
        body: { data, errors },
      } = await makeRequest({
        app,
        query: `
          {
            bans {
              items {
                id
              }
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.bans.items.length).toBe(bans.length);
    });
  });

  describe('createBan', () => {
    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createBan(data: {
              reason: "${faker.lorem.words(5)}",
              endsAt: "${faker.date.future().toDateString()}",
              userId: "${regularUser.user.id}",
            }) {
              id
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
    });

    it('should create a new ban', async () => {
      const user = await createDbUser(usersResolver);
      const admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createBan(data: {
              reason: "${faker.lorem.words(5)}",
              endsAt: "${faker.date.future().toDateString()}",
              userId: "${user.id}",
            }) {
              id
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.createBan.id).toBeTruthy();
    });
  });

  describe('findUserBans', () => {
    let admin: AuthUserWithToken;
    let bannedUser: AuthUserWithToken;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
      bannedUser = await createAuthUserWithToken(usersResolver, app);

      // ban user
      await makeRequest({
        app,
        query: `
          mutation {
            createBan(data: {
              reason: "${faker.lorem.words(5)}",
              endsAt: "${faker.date.future().toDateString()}",
              userId: "${bannedUser.user.id}",
            }) {
              id
            }
          }
        `,
        token: admin.token,
      });
    });

    it('should return an error for a user without permission', async () => {
      const unauthUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          {
            userBans(userId: "${bannedUser.user.id}" ) {
              id
            }
          }
        `,
        token: unauthUser.token,
      });

      expect(errors.length).toBe(1);
      expect(errors[0].statusCode).toBe(403);
    });

    it('should return bans for regular user', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            userBans(userId: "${bannedUser.user.id}" ) {
              id
            }
          }
        `,
        token: bannedUser.token,
      });

      expect(errors).toBeFalsy();
      expect(data.userBans).toBeTruthy();
    });
  });

  describe('updateBan', () => {
    let admin: AuthUserWithToken;
    let bannedUser: AuthUserWithToken;
    let banId: string;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
      bannedUser = await createAuthUserWithToken(usersResolver, app);

      // ban user
      const {
        body: { data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createBan(data: {
              reason: "${faker.lorem.words(5)}",
              endsAt: "${faker.date.future().toDateString()}",
              userId: "${bannedUser.user.id}",
            }) {
              id
            }
          }
        `,
        token: admin.token,
      });

      banId = data.createBan.id;
    });

    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateBan(id: "${bannedUser.user.id}", data: {
              reason: "${faker.random.words(3)}",
            }) {
              id
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
    });

    it('should update user', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateBan(id: "${banId}", data: {
              reason: "${faker.random.words(3)}",
            }) {
              id
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data).toBeTruthy();
    });
  });

  describe('removeBan', () => {
    let admin: AuthUserWithToken;
    let bannedUser: AuthUserWithToken;
    let banId: string;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
      bannedUser = await createAuthUserWithToken(usersResolver, app);

      // ban user
      const {
        body: { data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createBan(data: {
              reason: "${faker.lorem.words(5)}",
              endsAt: "${faker.date.future().toDateString()}",
              userId: "${bannedUser.user.id}",
            }) {
              id
            }
          }
        `,
        token: admin.token,
      });

      banId = data.createBan.id;
    });

    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            removeBan(id: "${banId}") {
              id
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
    });

    it('should return an error for a user without permission', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            removeBan(id: "${banId}") {
              id
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data).toBeTruthy();
    });
  });
});
