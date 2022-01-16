import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { MockType } from 'types/testing';
import { HashService } from 'utils/hash/hash.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UserService', () => {
  let usersService: UsersService;
  let usersRepository: MockType<UsersRepository>;
  let hashService: MockType<HashService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HashService,
          useFactory: jest.fn(() => ({ hash: jest.fn() })),
        },
        {
          provide: UsersRepository,
          useFactory: jest.fn(() => ({
            findUsers: jest.fn(),
            findUser: jest.fn(),
            findUserByUsername: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          })),
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    hashService = module.get(HashService);
  });

  describe('findAll', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'result';

      usersRepository.findUsers.mockResolvedValueOnce(repositoryResponse);

      const result = await usersService.findAll({ page: 1, limit: 1 });

      expect(result).toBe(repositoryResponse);
    });
  });

  describe('findOne', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'result';
      const id = '1';

      usersRepository.findUser.mockResolvedValueOnce(repositoryResponse);

      const result = await usersService.findOne(id);

      expect(result).toBe(repositoryResponse);
      expect(usersRepository.findUser).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'result';
      const dto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const password = 'password';

      usersRepository.createUser.mockResolvedValueOnce(repositoryResponse);
      hashService.hash.mockResolvedValueOnce(password);

      const result = await usersService.create(dto);

      expect(result).toBe(repositoryResponse);
      expect(hashService.hash).toHaveBeenCalledWith(dto.password);
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          password,
        }),
      );
    });
  });

  describe('update', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'result';
      const id = '1';
      const dto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const password = 'password';

      usersRepository.updateUser.mockResolvedValueOnce(repositoryResponse);
      hashService.hash.mockResolvedValueOnce(password);

      const result = await usersService.update(id, dto);

      expect(result).toBe(repositoryResponse);
      expect(hashService.hash).toHaveBeenCalledWith(dto.password);
      expect(usersRepository.updateUser).toHaveBeenCalledWith(id, {
        ...dto,
        password,
      });
    });
  });

  describe('remove', () => {
    it('should return proper value', async () => {
      const id = '1';
      const repositoryResponse = 'result';

      usersRepository.removeUser.mockResolvedValueOnce(repositoryResponse);

      const result = await usersService.remove(id);

      expect(result).toBe(repositoryResponse);
      expect(usersRepository.removeUser).toHaveBeenCalledWith(id);
    });
  });
});
