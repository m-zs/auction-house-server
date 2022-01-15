import { ParseUUIDPipe, UseGuards, UsePipes } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CtxUser } from 'components/auth/decorators/get-user.decorator';
import { UserIdGuard } from 'guards/user-id.guard';
import { RoleGuard } from 'guards/user-role.guard';
import { USER_ROLE } from 'components/users/user.types';
import { JwtGuard } from 'components/auth/guards/jwt.guard';
import { PaginationPipe } from 'pipes/pagination.pipe';
import { PaginationArgs } from 'utils/arguments/pagination.argument';
import { BansService } from './bans.service';
import { Ban } from './entities/ban.entity';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { FindAllBans } from './responses/find-all.response';
import { User } from 'components/users/entities/user.entity';
import { BaseBanResponse } from './responses/base-ban-response';

@UseGuards(JwtGuard)
@Resolver()
export class BansResolver {
  constructor(private readonly bansService: BansService) {}

  @Mutation(() => BaseBanResponse, {
    nullable: true,
    description: 'Create user ban (user will be banned)',
  })
  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  async createBan(
    @Args('data') createBanDto: CreateBanDto,
    @CtxUser() ctxUser: User,
  ): Promise<BaseBanResponse | void> {
    return await this.bansService.create(createBanDto, ctxUser.id);
  }

  @Query(() => FindAllBans, {
    name: 'bans',
    description: 'Find all bans',
    nullable: true,
  })
  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @UsePipes(new PaginationPipe())
  async findAll(@Args() { page, limit }: PaginationArgs): Promise<FindAllBans> {
    return await this.bansService.findAll({ page, limit });
  }

  @Query(() => [Ban], {
    name: 'userBans',
    description: 'Find all bans for given user id',
    nullable: true,
  })
  @UseGuards(UserIdGuard('userId'))
  async findUserBans(
    @Args('userId', ParseUUIDPipe) id: string,
  ): Promise<Ban[] | void> {
    return await this.bansService.findUserBans(id);
  }

  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @Mutation(() => BaseBanResponse, {
    description: 'Update existing ban',
    nullable: true,
  })
  async updateBan(
    @Args('data') updateBanDto: UpdateBanDto,
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<BaseBanResponse | void> {
    return await this.bansService.update(id, updateBanDto);
  }

  @UseGuards(RoleGuard(USER_ROLE.ADMIN))
  @Mutation(() => BaseBanResponse, {
    description:
      'Remove ban entry (will unban user if active entry is removed)',
    nullable: true,
  })
  async removeBan(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<BaseBanResponse | void> {
    return await this.bansService.remove(id);
  }
}
