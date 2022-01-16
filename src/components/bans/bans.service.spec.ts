import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { MockType } from 'types/testing';
import { BansRepository } from './bans.repository';
import { BansService } from './bans.service';

describe('BansService', () => {
  let bansService: BansService;
  let bansRepository: MockType<BansRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BansService,
        {
          provide: BansRepository,
          useFactory: jest.fn(() => ({
            banUser: jest.fn(),
            findBans: jest.fn(),
            findUserBans: jest.fn(),
            updateBan: jest.fn(),
            removeBan: jest.fn(),
          })),
        },
      ],
    }).compile();

    bansService = module.get<BansService>(BansService);
    bansRepository = module.get(BansRepository);
  });

  describe('create', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const data = {
        reason: faker.lorem.words(3),
        endsAt: new Date().toDateString(),
        userId: faker.datatype.uuid(),
      };
      const id = faker.datatype.uuid();

      bansRepository.banUser.mockResolvedValueOnce(repositoryResponse);

      const result = await bansService.create(data, id);

      expect(result).toBe(repositoryResponse);
      expect(bansRepository.banUser).toHaveBeenCalledWith(data, id);
    });
  });

  describe('findAll', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const args = { page: 1, limit: 1 };

      bansRepository.findBans.mockResolvedValueOnce(repositoryResponse);

      const result = await bansService.findAll(args);

      expect(result).toBe(repositoryResponse);
      expect(bansRepository.findBans).toHaveBeenCalledWith(args);
    });
  });

  describe('update', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const id = faker.datatype.uuid();
      const data = {
        reason: faker.lorem.words(3),
        endsAt: new Date().toDateString(),
      };

      bansRepository.updateBan.mockResolvedValueOnce(repositoryResponse);

      const result = await bansService.update(id, data);

      expect(result).toBe(repositoryResponse);
      expect(bansRepository.updateBan).toHaveBeenCalledWith(id, data);
    });
  });

  describe('remove', () => {
    it('should return proper value', async () => {
      const repositoryResponse = 'response';
      const id = faker.datatype.uuid();

      bansRepository.removeBan.mockResolvedValueOnce(repositoryResponse);

      const result = await bansService.remove(id);

      expect(result).toBe(repositoryResponse);
      expect(bansRepository.removeBan).toHaveBeenCalledWith(id);
    });
  });
});
