import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'user';

export class user1636901042155 implements MigrationInterface {
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
            name: 'username',
            type: 'varchar',
            length: '32',
          },
          {
            name: 'password',
            type: 'char',
            length: '60',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'role',
            type: 'int2',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()::timestamp',
          },
          {
            name: 'session',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
