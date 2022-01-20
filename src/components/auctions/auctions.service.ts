import { Injectable } from '@nestjs/common';

import { CreateAuctionInput } from './dto/create-auction.input';
import { UpdateAuctionInput } from './dto/update-auction.input';

@Injectable()
export class AuctionsService {
  create(_createAuctionInput: CreateAuctionInput) {
    return 'This action adds a new auction';
  }

  findAll() {
    return `This action returns all auctions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auction`;
  }

  update(id: number, _updateAuctionInput: UpdateAuctionInput) {
    return `This action updates a #${id} auction`;
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }
}
