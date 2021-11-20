import { InputType, PartialType, OmitType } from '@nestjs/graphql';

import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username']),
) {}
