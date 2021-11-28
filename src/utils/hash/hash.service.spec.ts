import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { MockType } from 'types/testing';
import { HashService } from './hash.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('HashService', () => {
  let hashService: HashService;
  let configService: MockType<ConfigService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        {
          provide: ConfigService,
          useFactory: jest.fn(() => ({ get: jest.fn() })),
        },
      ],
    }).compile();

    hashService = module.get<HashService>(HashService);
    configService = module.get(ConfigService);
  });

  it('should call dependencies with default arguments and return string', async () => {
    const string = 'string';
    const saltRounds = 1;
    const hashResult = 'hashResult';

    configService.get.mockReturnValueOnce(saltRounds);
    (bcrypt.hash as jest.Mock).mockReturnValueOnce(hashResult);

    const result = await hashService.hash(string);

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(string, saltRounds);
    expect(result).toBe(hashResult);
  });

  it('should call dependencies with provided arguments and return string', async () => {
    const string = 'string';
    const saltRounds = 100;
    const hashResult = 'hashResult';

    configService.get.mockReturnValueOnce(saltRounds);
    (bcrypt.hash as jest.Mock).mockReturnValueOnce(hashResult);

    const result = await hashService.hash(string, saltRounds);

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(string, saltRounds);
    expect(result).toBe(hashResult);
  });
});
