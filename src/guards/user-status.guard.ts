import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { GlobalContext } from 'types/context';
import { USER_STATUS } from 'components/users/user.types';

export const UserStatusGuard = ({
  max = USER_STATUS.ACTIVE,
  equal,
}: {
  max?: USER_STATUS;
  equal?: USER_STATUS;
} = {}): Type<CanActivate> => {
  class UserStatusGuardMixin implements CanActivate {
    canActivate(
      ctx: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const { status } =
        GqlExecutionContext.create(ctx).getContext<GlobalContext>().req.user;

      if ((equal !== undefined && status !== equal) || status > max) {
        return false;
      }

      return true;
    }
  }

  return mixin(UserStatusGuardMixin);
};
