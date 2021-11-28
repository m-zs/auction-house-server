import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'components/users/users.repository';
import { User } from 'components/users/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenPayload } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const { id, username, password, role, status } =
      (await this.userRepository.findUserByUsername(
        authCredentialsDto.username,
      )) || {};

    if (
      !(id && (await bcrypt.compare(authCredentialsDto.password, password)))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.createRefreshToken(username, id);

    await this.userRepository.updateSession(id, refreshToken);

    return {
      token: this.createAccessToken({ username, id, role, status }),
      refreshToken,
    };
  }

  async signOut(ctxUser: User): Promise<boolean> {
    return this.userRepository.updateSession(ctxUser.id, null);
  }

  refresh(ctxUser: User): TokenPayload {
    const { username, id, role, status } = ctxUser;

    return { token: this.createAccessToken({ username, id, role, status }) };
  }

  createRefreshToken(username: string, id: string): string {
    return this.jwtService.sign(
      { username, id },
      {
        // todo: adjust after testing
        expiresIn: '7d',
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
  }

  createAccessToken({
    username,
    id,
    role,
    status,
  }: {
    username: string;
    id: string;
    role: number;
    status: number;
  }): string {
    return this.jwtService.sign(
      { username, id, role, status },
      {
        // todo: adjust after testing
        expiresIn: '7d',
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
