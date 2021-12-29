import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import dbConfiguration from './config/db.config';
import { UsersModule } from './components/users/users.module';
import { AuthModule } from './components/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
      formatError: (error: GraphQLError) => ({
        message: error?.extensions?.response?.message || error?.message,
        statusCode: error?.extensions?.response?.statusCode,
        code: error?.extensions?.code,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
