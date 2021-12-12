import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthCredentialsDto {
  @Field()
  username: string;

  @Field()
  password: string;
}
