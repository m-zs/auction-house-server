import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { UsersModule } from './components/users/users.module';
import { AuthModule } from './components/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
