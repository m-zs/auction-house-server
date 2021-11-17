import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findUsers();
  }

  async findOne(id: string) {
    return this.userRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });
  }

  update(id: string, _UpdateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      Number(this.configService.get('SALT_ROUNDS')),
    );
  }
}
