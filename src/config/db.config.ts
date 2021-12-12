import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => {
  const configBase = {
    type: 'postgres',
    autoLoadEntities: true,
    entities: [join(__dirname, '..', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations/*.{ts,js}')],
    seeds: ['src/seeds/*.{ts,js}'],
    factories: ['src/factories/*.{ts,js}'],
  };

  switch (process.env.NODE_ENV) {
    case 'test':
      return {
        ...configBase,
        host: process.env.POSTGRES_HOST_TEST,
        port: +process.env.POSTGRES_PORT_TEST,
        username: process.env.POSTGRES_USER_TEST,
        password: process.env.POSTGRES_PASSWORD_TEST,
        database: process.env.POSTGRES_DATABASE_TEST,
      };
    default:
      return {
        ...configBase,
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        logging: true,
      };
  }
});
