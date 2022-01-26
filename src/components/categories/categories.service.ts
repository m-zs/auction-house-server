import { Injectable } from '@nestjs/common';

import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryOptionsDto } from './dto/find-all-search-options.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BaseCategoryResponse } from './responses/base-category.response';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<BaseCategoryResponse | void> {
    return this.categoriesRepository.createCategory(createCategoryDto);
  }

  async findOne(
    options: FindCategoryOptionsDto,
  ): Promise<BaseCategoryResponse | void> {
    return this.categoriesRepository.findCategory(options);
  }

  async findCategoryTree(
    options: FindCategoryOptionsDto,
  ): Promise<Category | void> {
    return this.categoriesRepository.findCategoryTree(options);
  }

  async findAll(): Promise<Category[] | void> {
    return this.categoriesRepository.findCategories();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<BaseCategoryResponse | void> {
    return this.categoriesRepository.updateCategory(id, updateCategoryDto);
  }

  async remove(id: string): Promise<BaseCategoryResponse | void> {
    return this.categoriesRepository.removeCategory(id);
  }
}
