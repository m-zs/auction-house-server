import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Auction {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
