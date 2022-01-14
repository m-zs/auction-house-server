import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    return await this.paginate(options);
  }

  async findUser(id: string): Promise<User | void> {
    return await this.findOne(id);
  }

  async findUserByUsername(username: string): Promise<User | void> {
    return await this.findOne({ username });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | void> {
    const user = this.create(createUserDto);

    return await this.save(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | void> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    await this.update({ id }, updateUserDto);

    return { ...user, ...updateUserDto };
  }

  async removeUser(id: string): Promise<User | void> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    await this.delete({ id });

    return user;
  }

  async updateSession(id: string, session: string): Promise<boolean> {
    const { affected } = await this.update({ id }, { session });

    return !!affected;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this, options);
  }
}
