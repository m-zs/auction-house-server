import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'components/users/users.repository';
import { MockType } from 'types/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'components/users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  const user = {
    username: faker.internet.userName(),
    id: faker.datatype.uuid(),
    role: 'user',
    status: faker.datatype.number(),
  } as unknown as User;
  let authService: AuthService;
  let usersRepository: MockType<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useFactory: () => ({
            findUserByUsername: jest.fn(),
            updateSession: jest.fn(),
          }),
        },
        { provide: JwtService, useFactory: () => ({}) },
        { provide: ConfigService, useFactory: () => ({}) },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
  });

  describe('signIn', () => {
    it('should return valid tokens', async () => {
      const credentials = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      const findUserByUsernameResponse = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'user',
        status: faker.datatype.number(),
        id: faker.datatype.uuid(),
      };
      const tokens = {
        refresh: 'refresh token',
        access: 'access token',
      };

      usersRepository.findUserByUsername.mockResolvedValueOnce(
        findUserByUsernameResponse,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jest
        .spyOn(authService, 'createRefreshToken')
        .mockImplementationOnce(() => tokens.refresh);
      jest
        .spyOn(authService, 'createAccessToken')
        .mockImplementationOnce(() => tokens.access);

      const result = await authService.signIn(credentials);

      expect(usersRepository.findUserByUsername).toHaveBeenCalledWith(
        credentials.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        findUserByUsernameResponse.password,
      );
      expect(authService.createRefreshToken).toHaveBeenCalledWith(
        findUserByUsernameResponse.username,
        findUserByUsernameResponse.id,
      );
      expect(authService.createAccessToken).toHaveBeenCalledWith({
        username: findUserByUsernameResponse.username,
        id: findUserByUsernameResponse.id,
        role: findUserByUsernameResponse.role,
        status: findUserByUsernameResponse.status,
      });
      expect(result).toStrictEqual({
        token: tokens.access,
        refreshToken: tokens.refresh,
      });
    });

    it('should throw UnauthorizedException', async () => {
      const credentials = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      const findUserByUsernameResponse = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'user',
        status: faker.datatype.number(),
        id: faker.datatype.uuid(),
      };

      usersRepository.findUserByUsername.mockResolvedValueOnce(
        findUserByUsernameResponse,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.signIn(credentials)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('signOut', () => {
    it('should return proper value', async () => {
      const updateSessionReturn = true;

      usersRepository.updateSession.mockResolvedValueOnce(updateSessionReturn);

      const result = await authService.signOut(user);

      expect(usersRepository.updateSession).toHaveBeenCalledWith(user.id, null);
      expect(result).toBe(updateSessionReturn);
    });
  });

  describe('refresh', () => {
    it('should return proper value', async () => {
      const token = 'token';

      jest
        .spyOn(authService, 'createAccessToken')
        .mockImplementationOnce(() => token);

      const result = authService.refresh(user);

      expect(result).toStrictEqual({ token });
      expect(authService.createAccessToken).toHaveBeenCalledWith({
        username: user.username,
        id: user.id,
        role: user.role,
        status: user.status,
      });
    });
  });
});
