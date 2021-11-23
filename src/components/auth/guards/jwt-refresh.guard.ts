import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(ctx: ExecutionContext) {
    return GqlExecutionContext.create(ctx).getContext().req;
  }
}
