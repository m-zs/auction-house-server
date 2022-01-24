import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesSearchOptionsDto } from './dto/find-all-search-options.dto';
import { BaseCategoryResponse } from './responses/base-category.response';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => BaseCategoryResponse, { nullable: true })
  async createCategory(
    @Args('data') data: CreateCategoryDto,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.create(data);
  }

  @Query(() => [Category], {
    description: 'Find all categories and subcategories',
    nullable: true,
    name: 'categories',
  })
  async findAll(
    @Args('options', { nullable: true })
    options?: FindCategoriesSearchOptionsDto,
  ): Promise<Category[] | void> {
    return await this.categoriesService.findAll(options);
  }

  @Query(() => BaseCategoryResponse, { name: 'category', nullable: true })
  async findOne(
    @Args('options') options: FindCategoriesSearchOptionsDto,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.findOne(options);
  }

  @Mutation(() => BaseCategoryResponse)
  async updateCategory(
    @Args('data') data: UpdateCategoryDto,
    @Args('id') id: string,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.update(id, data);
  }

  @Mutation(() => BaseCategoryResponse)
  async removeCategory(
    @Args('id') id: string,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.remove(id);
  }
}
