import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, email } = createUserDto;

    await this.save(
      this.create({
        username,
        email,
        password: await this.hashPassword(password),
      }),
    );
  }

  async findUsers(): Promise<User[]> {
    return await this.find();
  }

  async findUser(id: string): Promise<User | void> {
    return await this.findOne(id);
  }

  async findUserByUsername(username: string): Promise<User | void> {
    return await this.findOne({ username });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { password } = updateUserDto;

    await this.update(
      { id },
      {
        ...updateUserDto,
        ...(password && {
          password: await this.hashPassword(password),
        }),
      },
    );
  }

  async removeUser(id: string): Promise<void> {
    await this.delete(id);
  }

  async updateSession(id: string, session?: string): Promise<void> {
    await this.update({ id }, { session });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.configService.get('SALT_ROUNDS'));
  }
}
