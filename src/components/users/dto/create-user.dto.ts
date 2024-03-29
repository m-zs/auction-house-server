import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { USER_ROLE } from '../user.types';

@InputType()
export class CreateUserDto {
  @Field({ description: 'User username' })
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @Field({ description: 'User email' })
  @IsEmail()
  email: string;

  @Field({ description: 'User password' })
  @MinLength(4)
  @MaxLength(60)
  password: string;

  role?: USER_ROLE;
}
