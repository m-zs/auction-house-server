import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@ObjectType()
@Entity()
@Tree('closure-table')
export class Category {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Category], { nullable: true })
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  // if category can be populated with auctions
  @Field()
  @Column({ default: false })
  canPopulate: boolean;
}
