import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsResolver } from './auctions.resolver';
import { AuctionsService } from './auctions.service';

describe('AuctionsResolver', () => {
  let resolver: AuctionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuctionsResolver, AuctionsService],
    }).compile();

    resolver = module.get<AuctionsResolver>(AuctionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
