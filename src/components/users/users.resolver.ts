import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  createUser(
    @Args('CreateUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Mutation(() => User)
  updateUser(@Args('UpdateUserDto') updateUserDto: UpdateUserDto, id: string) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
