import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuctionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
