import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field({ description: 'User username' })
  username: string;

  @Field({ description: 'User email' })
  email: string;

  @Field({ description: 'User password' })
  password: string;
}
