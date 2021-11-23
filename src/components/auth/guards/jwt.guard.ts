import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(ctx: ExecutionContext) {
    return GqlExecutionContext.create(ctx).getContext().req;
  }
}
