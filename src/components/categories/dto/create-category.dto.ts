import { InputType, Field } from '@nestjs/graphql';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateCategoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  canPopulate?: boolean = false;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
