import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { MockType } from 'types/testing';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';

describe('CategoriesResolver', () => {
  let categoriesResolver: CategoriesResolver;
  let categoriesService: MockType<CategoriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesResolver,
        {
          provide: CategoriesService,
          useFactory: jest.fn(() => ({
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          })),
        },
      ],
    }).compile();

    categoriesResolver = module.get<CategoriesResolver>(CategoriesResolver);
    categoriesService = module.get(CategoriesService);
  });

  describe('create', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const data = {
        name: faker.random.word(),
      };

      categoriesService.create.mockResolvedValueOnce(serviceResponse);

      const result = await categoriesResolver.createCategory(data);

      expect(result).toBe(serviceResponse);
      expect(categoriesService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('findAll', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const args = { name: faker.random.word() };

      categoriesService.findAll.mockResolvedValueOnce(serviceResponse);

      const result = await categoriesResolver.findAll(args);

      expect(result).toBe(serviceResponse);
      expect(categoriesService.findAll).toHaveBeenCalledWith(args);
    });
  });

  describe('findOne', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const args = { name: faker.random.word() };

      categoriesService.findOne.mockResolvedValueOnce(serviceResponse);

      const result = await categoriesResolver.findOne(args);

      expect(result).toBe(serviceResponse);
      expect(categoriesService.findOne).toHaveBeenCalledWith(args);
    });
  });

  describe('updateCategory', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const id = faker.datatype.uuid();
      const data = {
        name: faker.random.word(),
      };

      categoriesService.update.mockResolvedValueOnce(serviceResponse);

      const result = await categoriesResolver.updateCategory(data, id);

      expect(result).toBe(serviceResponse);
      expect(categoriesService.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('removeCategory', () => {
    it('should return proper value', async () => {
      const serviceResponse = 'response';
      const id = faker.datatype.uuid();

      categoriesService.remove.mockResolvedValueOnce(serviceResponse);

      const result = await categoriesResolver.removeCategory(id);

      expect(result).toBe(serviceResponse);
      expect(categoriesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
