import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/components/users/entities/user.entity';
import { UserRepository } from 'src/components/users/user.repository';
import { JWTPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const user = await this.userRepository.findUser(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
