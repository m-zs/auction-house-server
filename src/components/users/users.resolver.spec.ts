import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'types/testing';
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
            createUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          })),
        },
      ],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
    expect(usersService).toBeDefined();
  });
});
