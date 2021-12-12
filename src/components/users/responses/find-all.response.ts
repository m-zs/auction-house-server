import { ObjectType } from '@nestjs/graphql';

import { paginatedResponse } from 'utils/responses/pagination.response';
import { User } from '../entities/user.entity';

@ObjectType()
export class FindAllResponse extends paginatedResponse<User>(User) {}
