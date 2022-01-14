import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { GlobalContext } from 'types/context';
import { USER_ROLE } from 'components/users/user.types';

export const UserIdGuard = (idField: string): Type<CanActivate> => {
  class UserIdGuardMixin implements CanActivate {
    canActivate(
      ctx: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const context = GqlExecutionContext.create(ctx);
      const request = context.getContext<GlobalContext>().req;

      if (request.user.role >= USER_ROLE.ADMIN) {
        return true;
      }

      return context.getArgs()[idField] === request.user.id;
    }
  }

  return mixin(UserIdGuardMixin);
};
