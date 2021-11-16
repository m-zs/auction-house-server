import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(_CreateUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findUsers();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _UpdateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
