import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CtxUser = createParamDecorator(
  (_, ctx) => GqlExecutionContext.create(ctx).getContext().req.user,
);
