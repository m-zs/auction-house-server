import {
  // ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

// import { MockType } from 'src/types/testing';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';

describe('UserService', () => {
  let userService: UsersService;
  // let _userRepository: MockType<UserRepository>;
  // let _config: MockType<ConfigModule>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: jest.fn() },
        { provide: ConfigService, useFactory: jest.fn() },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    // _userRepository = module.get(UserRepository);
    // _config = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
