import { NotFoundException } from '@nestjs/common';
import { EntityRepository, getManager, Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryOptionsDto } from './dto/find-all-search-options.dto';
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

  async findCategoryTree(
    options: FindCategoryOptionsDto,
  ): Promise<Category | void> {
    const category = await this.findCategoryByOptions(options);

    return await getManager()
      .getTreeRepository(Category)
      .findDescendantsTree(category as Category);
  }

  async findCategories(): Promise<Category[] | void> {
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

    await this.update({ id }, { ...updateCategoryDto });

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
