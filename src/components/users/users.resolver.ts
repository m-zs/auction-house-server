import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CtxUser } from '../auth/decorators/get-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users', nullable: 'items' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
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
