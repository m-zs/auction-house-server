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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create(createUserDto);

    await this.save(user);

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.update({ id }, updateUserDto);
  }

  async removeUser(id: string): Promise<void> {
    await this.delete(id);
  }

  async updateSession(id: string, session?: string): Promise<void> {
    await this.update({ id }, { session });
  }
}
