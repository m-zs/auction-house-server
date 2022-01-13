import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const TABLE_NAME = 'ban';

export class bans1642065746087 implements MigrationInterface {
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
            name: 'reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'issuedAt',
            type: 'timestamp',
            default: 'now()::timestamp',
          },
          {
            name: 'endsAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'issuerId',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys(TABLE_NAME, [
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        columnNames: ['issuerId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
