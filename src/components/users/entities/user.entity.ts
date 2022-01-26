import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Ban } from '../../bans/entities/ban.entity';

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

  @Exclude({ toPlainOnly: true })
  @Column()
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

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  session?: string;

  @OneToMany(() => Ban, (ban) => ban.receiver)
  receivedBans: Ban[];

  @OneToMany(() => Ban, (ban) => ban.issuer)
  issuedBans: Ban[];
}
