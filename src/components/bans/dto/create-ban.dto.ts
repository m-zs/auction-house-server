import { InputType, Field } from '@nestjs/graphql';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';

import { IsAfterDate } from 'utils/validators';

@InputType()
export class CreateBanDto {
  @Field({ description: 'Ban reason', nullable: true })
  @IsString()
  @IsOptional()
  reason?: string;

  @Field({ description: 'Ban end date' })
  @IsDateString()
  @Validate(IsAfterDate, ['currentDate'])
  endsAt?: string;

  @Field({ description: 'Banned user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  currentDate?: Date;

  constructor() {
    this.currentDate = new Date();
  }
}
