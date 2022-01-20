import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuctionsService } from './auctions.service';
import { Auction } from './entities/auction.entity';
import { CreateAuctionInput } from './dto/create-auction.input';
import { UpdateAuctionInput } from './dto/update-auction.input';

@Resolver(() => Auction)
export class AuctionsResolver {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Mutation(() => Auction)
  createAuction(
    @Args('createAuctionInput') createAuctionInput: CreateAuctionInput,
  ) {
    return this.auctionsService.create(createAuctionInput);
  }

  @Query(() => [Auction], { name: 'auctions' })
  findAll() {
    return this.auctionsService.findAll();
  }

  @Query(() => Auction, { name: 'auction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.auctionsService.findOne(id);
  }

  @Mutation(() => Auction)
  updateAuction(
    @Args('updateAuctionInput') updateAuctionInput: UpdateAuctionInput,
  ) {
    return this.auctionsService.update(
      updateAuctionInput.id,
      updateAuctionInput,
    );
  }

  @Mutation(() => Auction)
  removeAuction(@Args('id', { type: () => Int }) id: number) {
    return this.auctionsService.remove(id);
  }
}
