import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'types/testing';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: MockType<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          })),
        },
      ],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
  });

  describe('findAll', () => {
    it('should return proper value', async () => {
      const serviceResponse = [1, 2, 3];

      usersService.findAll.mockResolvedValueOnce(serviceResponse);

      const result = await usersResolver.findAll({ limit: 1, page: 1 });

      expect(result).toBe(serviceResponse);
    });
  });

  describe('findOne', () => {
    it('should return proper value', async () => {
      const serviceResponse = [1, 2, 3];
      const id = '1';

      usersService.findOne.mockResolvedValueOnce(serviceResponse);

      const result = await usersResolver.findOne(id);

      expect(result).toBe(serviceResponse);
    });
  });

  describe('createUser', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'result';

      usersService.create.mockResolvedValueOnce(serviceResponse);

      const result = await usersResolver.createUser({
        username: 'user',
        password: 'password',
        email: 'email@email.com',
      });

      expect(result).toBe(serviceResponse);
    });
  });

  describe('updateUser', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'result';

      usersService.update.mockResolvedValueOnce(serviceResponse);

      const result = await usersResolver.updateUser(
        {
          password: 'password',
          email: 'email@email.com',
        },
        {} as User,
      );

      expect(result).toBe(serviceResponse);
    });
  });

  describe('removeUser', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'result';

      usersService.remove.mockResolvedValueOnce(serviceResponse);

      const result = await usersResolver.removeUser({} as User);

      expect(result).toBe(serviceResponse);
    });
  });
});
