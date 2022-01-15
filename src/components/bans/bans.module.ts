import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BansService } from './bans.service';
import { BansResolver } from './bans.resolver';
import { BansRepository } from './bans.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BansRepository])],
  providers: [BansResolver, BansService],
})
export class BansModule {}
