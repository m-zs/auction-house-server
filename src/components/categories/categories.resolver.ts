import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtGuard } from 'components/auth/guards/jwt.guard';
import { RoleGuard } from 'guards/user-role.guard';
import { USER_ROLE } from 'components/users/user.types';
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
  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @UseGuards(JwtGuard)
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
  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @UseGuards(JwtGuard)
  async updateCategory(
    @Args('data') data: UpdateCategoryDto,
    @Args('id') id: string,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.update(id, data);
  }

  @Mutation(() => BaseCategoryResponse)
  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @UseGuards(JwtGuard)
  async removeCategory(
    @Args('id') id: string,
  ): Promise<BaseCategoryResponse | void> {
    return await this.categoriesService.remove(id);
  }
}
