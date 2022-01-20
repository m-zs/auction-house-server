import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

import { AUCTION_STATUS } from '../components/auctions/auctions.types';

const TABLE_NAME = 'auction';

export class auctions1642599898895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar(240)',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()::timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()::timestamp',
            onUpdate: 'now()::timestamp',
          },
          {
            name: 'status',
            type: 'int2',
            default: AUCTION_STATUS.DRAFT,
          },
          {
            name: 'buyoutPrice',
            type: 'decimal(10,2)',
          },
          {
            name: 'itemAmount',
            type: 'integer',
          },
          {
            name: 'specification',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TABLE_NAME,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
