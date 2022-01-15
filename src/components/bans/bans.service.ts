import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

import { BansRepository } from './bans.repository';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Ban } from './entities/ban.entity';
import { BaseBanResponse } from './responses/base-ban-response';

@Injectable()
export class BansService {
  constructor(private readonly bansRepository: BansRepository) {}

  async create(
    createBanDto: CreateBanDto,
    issuerId: string,
  ): Promise<BaseBanResponse | void> {
    return this.bansRepository.banUser(createBanDto, issuerId);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Ban>> {
    return this.bansRepository.findBans(options);
  }

  async findUserBans(id: string): Promise<Ban[] | void> {
    return this.bansRepository.findUserBans(id);
  }

  async update(
    id: string,
    updateBanDto: UpdateBanDto,
  ): Promise<BaseBanResponse | void> {
    return this.bansRepository.updateBan(id, updateBanDto);
  }

  async remove(id: string): Promise<BaseBanResponse | void> {
    return this.bansRepository.deleteBan(id);
  }
}
