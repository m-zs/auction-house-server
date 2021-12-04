import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards, UsePipes } from '@nestjs/common';

import { PaginationArgs } from 'utils/arguments/pagination.argument';
import { PaginationPipe } from 'pipes/pagination.pipe';
import { FindAllResponse } from './responses/find-all.response';
import { JwtGuard } from 'components/auth/guards/jwt.guard';
import { CtxUser } from 'components/auth/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => FindAllResponse, { name: 'users' })
  @UsePipes(new PaginationPipe())
  async findAll(
    @Args() { page, limit }: PaginationArgs,
  ): Promise<FindAllResponse> {
    return await this.usersService.findAll({ page, limit });
  }

  @Query(() => User, {
    name: 'user',
    description: 'Find user by id',
    nullable: true,
  })
  async findOne(@Args('id', ParseUUIDPipe) id: string): Promise<User | void> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User, { description: 'Create new user', nullable: true })
  async createUser(
    @Args('CreateUserDto') createUserDto: CreateUserDto,
  ): Promise<User | void> {
    return await this.usersService.create(createUserDto);
  }

  @Mutation(() => User, {
    description: 'Update existing user',
    nullable: true,
  })
  @UseGuards(JwtGuard)
  async updateUser(
    @Args('UpdateUserDto') updateUserDto: UpdateUserDto,
    @CtxUser() ctxUser: User,
  ): Promise<User | void> {
    return await this.usersService.update(ctxUser.id, updateUserDto);
  }

  @Mutation(() => User, {
    description: 'Remove existing user',
    nullable: true,
  })
  @UseGuards(JwtGuard)
  async removeUser(@CtxUser() ctxUser: User): Promise<User | void> {
    return await this.usersService.remove(ctxUser.id);
  }
}
