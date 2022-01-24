import { NotFoundException } from '@nestjs/common';
import { EntityRepository, getManager, Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import {
  FindCategoriesSearchOptionsDto,
  FindCategoryOptionsDto,
} from './dto/find-all-search-options.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BaseCategoryResponse } from './responses/base-category.response';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async findCategory({
    id,
    name,
  }: FindCategoryOptionsDto): Promise<BaseCategoryResponse | void> {
    return await this.findOne({
      ...(id && { id }),
      ...(name && !id && { name }),
    });
  }

  async findCategories(
    options: FindCategoriesSearchOptionsDto,
  ): Promise<Category[] | void> {
    if (options?.id || options?.name) {
      return await getManager()
        .getTreeRepository(Category)
        .createDescendantsQueryBuilder(
          'category',
          'categoryClosure',
          (await this.findCategoryByOptions(options)) as Category,
        )
        .getMany();
    }

    return await getManager().getTreeRepository(Category).findTrees();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<BaseCategoryResponse | void> {
    if (!createCategoryDto.parentId) {
      return await this.save(this.create({ ...createCategoryDto }));
    }

    const parent = await this.findOne(createCategoryDto.parentId);

    const child = this.create(createCategoryDto);
    child.parent = parent;

    return await this.save(child);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<BaseCategoryResponse | void> {
    const category = await this.findOne({ id });

    await this.update({ id }, updateCategoryDto);

    return { ...category, ...updateCategoryDto };
  }

  async removeCategory(id: string): Promise<BaseCategoryResponse | void> {
    const category = await this.findCategoryByOptions({ id });

    await this.delete({ id });

    return category;
  }

  async findCategoryByOptions({
    id,
    name,
  }: {
    id?: string;
    name?: string;
  }): Promise<BaseCategoryResponse | void> {
    const category = await this.findOne({
      ...(id && { id }),
      ...(name && !id && { name }),
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ${id ? `id: ${id}` : `name: ${name}`} not found`,
      );
    }

    return category;
  }
}
