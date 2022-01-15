import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'components/users/entities/user.entity';

@ObjectType()
@Entity()
export class Ban {
  @Field({ description: 'Ban id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ description: 'Ban reason', nullable: true })
  @Column()
  reason?: string;

  @Field({ description: 'Ban start time' })
  @CreateDateColumn({ type: 'timestamp' })
  issuedAt: Date;

  @Field({ description: 'Ban end time', nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  endsAt?: Date;

  @Column()
  userId: string;

  @Column()
  issuerId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.issuedBans)
  @JoinColumn({ name: 'issuerId' })
  issuer: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.receivedBans)
  @JoinColumn({ name: 'userId' })
  receiver: User;
}
