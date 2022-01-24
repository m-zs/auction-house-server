import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString, IsUUID, ValidateIf } from 'class-validator';

@InputType()
export class FindCategoryOptionsDto {
  @Field({ nullable: true })
  @IsString()
  @ValidateIf((values) => !values.id)
  name?: string;

  @Field({ nullable: true })
  @IsUUID()
  @ValidateIf((values) => !values.name)
  id?: string;
}

@InputType()
export class FindCategoriesSearchOptionsDto extends PartialType(
  FindCategoryOptionsDto,
) {}
