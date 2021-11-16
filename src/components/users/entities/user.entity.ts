import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field({ description: 'User id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ description: 'User username' })
  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Field({ description: 'User status' })
  @Column()
  status: number;

  @Field({ description: 'User role' })
  @Column()
  role: number;

  @Field({ description: 'User creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
