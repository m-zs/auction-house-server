import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserRepository } from 'src/components/users/user.repository';
import { COOKIE_NAME } from '../auth.const';
import { JWTPayload } from '../dto/jwt-payload.dto';
import { User } from 'src/components/users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(UserRepository) private usersRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[COOKIE_NAME],
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload): Promise<User> {
    const user = await this.usersRepository.findUser(payload.id);

    if (!user || req?.cookies?.[COOKIE_NAME] !== user.session) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
