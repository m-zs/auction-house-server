import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { GlobalContext } from 'types/context';
import { USER_ROLE } from 'components/users/user.types';

export const RoleGuard = (role: USER_ROLE): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(
      ctx: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request =
        GqlExecutionContext.create(ctx).getContext<GlobalContext>().req;

      return request.user.role >= role;
    }
  }

  return mixin(RoleGuardMixin);
};
