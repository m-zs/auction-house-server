import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { MockType } from 'types/testing';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: MockType<CategoriesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useFactory: jest.fn(() => ({
            createCategory: jest.fn(),
            findCategory: jest.fn(),
            findCategories: jest.fn(),
            updateCategory: jest.fn(),
            removeCategory: jest.fn(),
          })),
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get(CategoriesRepository);
  });

  describe('create', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const data = {
        name: faker.random.word(),
      };

      categoriesRepository.createCategory.mockResolvedValueOnce(
        serviceResponse,
      );

      const result = await categoriesService.create(data);

      expect(result).toBe(serviceResponse);
      expect(categoriesRepository.createCategory).toHaveBeenCalledWith(data);
    });
  });

  describe('findOne', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const args = { name: faker.random.word() };

      categoriesRepository.findCategory.mockResolvedValueOnce(
        repositoryResponse,
      );

      const result = await categoriesService.findOne(args);

      expect(result).toBe(repositoryResponse);
      expect(categoriesRepository.findCategory).toHaveBeenCalledWith(args);
    });
  });

  describe('findAll', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';

      categoriesRepository.findCategories.mockResolvedValueOnce(
        repositoryResponse,
      );

      const result = await categoriesService.findAll();

      expect(result).toBe(repositoryResponse);
      expect(categoriesRepository.findCategories).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const id = faker.datatype.uuid();
      const data = {
        name: faker.random.word(),
      };

      categoriesRepository.updateCategory.mockResolvedValueOnce(
        repositoryResponse,
      );

      const result = await categoriesService.update(id, data);

      expect(result).toBe(repositoryResponse);
      expect(categoriesRepository.updateCategory).toHaveBeenCalledWith(
        id,
        data,
      );
    });
  });

  describe('remove', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const id = faker.datatype.uuid();

      categoriesRepository.removeCategory.mockResolvedValueOnce(
        repositoryResponse,
      );

      const result = await categoriesService.remove(id);

      expect(result).toBe(repositoryResponse);
      expect(categoriesRepository.removeCategory).toHaveBeenCalledWith(id);
    });
  });
});
