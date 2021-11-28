import { Injectable } from '@nestjs/common';

import { HashService } from 'utils/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findUsers();
  }

  async findOne(id: string) {
    return this.userRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User | void> {
    return this.userRepository.createUser({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | void> {
    const { password } = updateUserDto;

    return this.userRepository.updateUser(id, {
      ...updateUserDto,
      ...(password && {
        password: await this.hashService.hash(password),
      }),
    });
  }

  async remove(id: string): Promise<User | void> {
    return this.userRepository.removeUser(id);
  }
}
