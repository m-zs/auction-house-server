module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/components/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  factories: ['dist/factories/**/*.js'],
  logging: true,
  ...(process.env === 'development'
    ? {
        synchronize: true,
      }
    : {
        rejectUnauthorized: false,
      }),
};
