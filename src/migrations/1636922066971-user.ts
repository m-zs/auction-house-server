import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { USER_ROLE, USER_STATUS } from '../components/users/user.types';

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
            isUnique: true,
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
            isUnique: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '120',
            default: USER_STATUS.ACTIVE,
          },
          {
            name: 'role',
            type: 'int2',
            default: USER_ROLE.USER,
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
