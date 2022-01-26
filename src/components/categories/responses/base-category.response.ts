import { ObjectType, OmitType } from '@nestjs/graphql';

import { Category } from '../entities/category.entity';

@ObjectType()
export class BaseCategoryResponse extends OmitType(Category, ['children']) {}
