import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenPayload {
  @Field()
  token: string;
}
