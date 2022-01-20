import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsResolver } from './auctions.resolver';

@Module({
  providers: [AuctionsResolver, AuctionsService],
})
export class AuctionsModule {}
