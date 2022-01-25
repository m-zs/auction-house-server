import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { CreateBanDto } from './dto/create-ban.dto';
import { Ban } from './entities/ban.entity';
import { UpdateBanDto } from './dto/update-ban.dto';
import { BaseBanResponse } from './responses/base-ban-response';

@EntityRepository(Ban)
export class BansRepository extends Repository<Ban> {
  async banUser(
    createBanDto: CreateBanDto,
    issuerId: string,
  ): Promise<BaseBanResponse | void> {
    const ban = this.create({ ...createBanDto, issuerId });

    return await this.save(ban);
  }

  async findBans(options: IPaginationOptions): Promise<Pagination<Ban>> {
    return await this.paginate(options);
  }

  async findUserBans(userId: string): Promise<Ban[] | void> {
    return this.find({ where: { userId } });
  }

  async updateBan(
    id: string,
    updateBanDto: UpdateBanDto,
  ): Promise<BaseBanResponse | void> {
    const ban = await this.findBanById(id);

    await this.update({ id }, updateBanDto);

    return {
      ...ban,
      ...updateBanDto,
      ...(updateBanDto.endsAt && { endsAt: new Date(updateBanDto.endsAt) }),
    };
  }

  async removeBan(id: string): Promise<BaseBanResponse | void> {
    const ban = await this.findBanById(id);

    await this.delete({ id });

    return ban;
  }

  async findBanById(id: string): Promise<Ban> {
    const ban = await this.findOne(
      { id },
      { relations: ['issuer', 'receiver'] },
    );

    if (!ban) {
      throw new NotFoundException(`Ban with id: ${id} not found`);
    }

    return ban;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Ban>> {
    return paginate<Ban>(this, options, { relations: ['issuer', 'receiver'] });
  }
}
