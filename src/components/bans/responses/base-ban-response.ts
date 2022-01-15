import { ObjectType, OmitType } from '@nestjs/graphql';

import { Ban } from '../entities/ban.entity';

@ObjectType()
export class BaseBanResponse extends OmitType(Ban, [
  'receiver',
  'issuer',
  'issuerId',
  'userId',
]) {}
