import { InputType, OmitType, PartialType } from '@nestjs/graphql';

import { CreateBanDto } from './create-ban.dto';

@InputType()
export class UpdateBanDto extends PartialType(
  OmitType(CreateBanDto, ['issuerId', 'userId']),
) {}
