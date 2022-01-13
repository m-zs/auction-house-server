import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Meta {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

export function paginatedResponse<T>(type: Type<T>): any {
  @ObjectType()
  class PaginatedResponse {
    @Field(() => [type])
    items: T[];

    @Field(() => Meta)
    meta: Meta;
  }

  return PaginatedResponse;
}
