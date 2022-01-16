import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { MockType } from 'types/testing';
import { generateUser } from 'utils/test';
import { BansResolver } from './bans.resolver';
import { BansService } from './bans.service';

describe('BansResolver', () => {
  let bansResolver: BansResolver;
  let bansService: MockType<BansService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BansResolver,
        {
          provide: BansService,
          useFactory: jest.fn(() => ({
            create: jest.fn(),
            findAll: jest.fn(),
            findUserBans: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          })),
        },
      ],
    }).compile();

    bansResolver = module.get<BansResolver>(BansResolver);
    bansService = module.get(BansService);
  });

  describe('createBan', () => {
    it('should return proper response', async () => {
      const serviceResponse = 'response';
      const data = {
        reason: faker.lorem.words(3),
        endsAt: new Date().toDateString(),
        userId: faker.datatype.uuid(),
      };
      const user = generateUser();

      bansService.create.mockResolvedValueOnce(serviceResponse);

      const result = await bansResolver.createBan(data, user);

      expect(result).toBe(serviceResponse);
      expect(bansService.create).toHaveBeenCalledWith(data, user.id);
    });
  });

  describe('findAll', () => {
    it('should return proper response', async () => {
      const serviceResponse = 'response';
      const args = { page: 1, limit: 1 };

      bansService.findAll.mockResolvedValueOnce(serviceResponse);

      const result = await bansResolver.findAll(args);

      expect(result).toBe(serviceResponse);
      expect(bansService.findAll).toHaveBeenCalledWith(args);
    });
  });

  describe('findUserBans', () => {
    it('should return proper response', async () => {
      const serviceResponse = 'response';
      const id = faker.datatype.uuid();

      bansService.findUserBans.mockResolvedValueOnce(serviceResponse);

      const result = await bansResolver.findUserBans(id);

      expect(result).toBe(serviceResponse);
      expect(bansService.findUserBans).toHaveBeenCalledWith(id);
    });
  });

  describe('updateBan', () => {
    it('should return proper response', async () => {
      const serviceResponse = 'response';
      const id = faker.datatype.uuid();
      const data = {
        reason: faker.lorem.words(3),
        endsAt: new Date().toDateString(),
      };

      bansService.update.mockResolvedValueOnce(serviceResponse);

      const result = await bansResolver.updateBan(data, id);

      expect(result).toBe(serviceResponse);
      expect(bansService.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('removeBan', () => {
    it('should return proper response', async () => {
      const serviceResponse = 'response';
      const id = faker.datatype.uuid();

      bansService.remove.mockResolvedValueOnce(serviceResponse);

      const result = await bansResolver.removeBan(id);

      expect(result).toBe(serviceResponse);
      expect(bansService.remove).toHaveBeenCalledWith(id);
    });
  });
});
