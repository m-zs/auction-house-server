import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  page = 1;

  @Field(() => Int, { nullable: true })
  limit = 10;
}
