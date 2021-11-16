import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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

  @Mutation(() => User)
  createUser(@Args('CreateUserDto') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Mutation(() => User)
  updateUser(@Args('UpdateUserDto') updateUserDto: UpdateUserDto) {
    return this.usersService.update(1, updateUserDto);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
