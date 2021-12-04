import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  constructor(private readonly limitMax = 10) {}

  transform(value: { limit?: number; page?: number }) {
    const { page, limit } = value;

    if (page < 1) {
      throw new BadRequestException('Invalid page value (min: 1)');
    }

    if (limit < 1 || limit > this.limitMax) {
      throw new BadRequestException(
        `Invalid limit value (min: 1, max: ${this.limitMax})`,
      );
    }

    return value;
  }
}
