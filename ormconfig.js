module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  migrations: ['dist/migrations/*.js'],
  logging: true,
  ...(process.env === 'development'
    ? {
        synchronize: true,
      }
    : {
        rejectUnauthorized: false,
      }),
};
