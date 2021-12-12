import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async hash(
    str: string,
    saltRounds = Number(this.configService.get('SALT_ROUNDS')),
  ): Promise<string> {
    return await bcrypt.hash(str, saltRounds);
  }
}
