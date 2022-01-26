import { InputType, OmitType, PartialType } from '@nestjs/graphql';

import { CreateCategoryDto } from './create-category.dto';

@InputType()
export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['parentId']),
) {}
