import { ObjectType } from '@nestjs/graphql';

import { paginatedResponse } from 'utils/responses/pagination.response';
import { Ban } from '../entities/ban.entity';

@ObjectType()
export class FindAllBans extends paginatedResponse<Ban>(Ban) {}
