import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenPayload } from './dto/token-payload.dto';
import { COOKIE_NAME } from './auth.const';
import { GlobalContext } from 'src/types/context';
import { CtxUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshGuard } from './guards/jwt-refresh.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenPayload, { description: '', nullable: true })
  async signIn(
    @Args('credentials') credentials: AuthCredentialsDto,
    @Context() ctx: GlobalContext,
  ): Promise<TokenPayload> {
    const { token, refreshToken } = await this.authService.signIn(credentials);

    ctx.res.cookie(COOKIE_NAME, refreshToken, { httpOnly: true });

    return { token };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async signOut(
    @Context() ctx: GlobalContext,
    @CtxUser() ctxUser: User,
  ): Promise<boolean> {
    const result = await this.authService.signOut(ctxUser);

    if (result) {
      ctx.res.clearCookie(COOKIE_NAME);
    }

    return result;
  }

  @Mutation(() => TokenPayload)
  @UseGuards(JwtGuard, RefreshGuard)
  refresh(@CtxUser() ctxUser: User): TokenPayload {
    return this.authService.refresh(ctxUser);
  }
}
