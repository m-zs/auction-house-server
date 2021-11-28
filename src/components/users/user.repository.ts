import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUsers(): Promise<User[]> {
    return await this.find();
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

    return user;
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
    console.log(affected);

    return !!affected;
  }
}
