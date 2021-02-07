import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import User from '../user/user.entity';

@ObjectType()
@Entity()
class Token extends BaseEntity {
  @Field()
  @PrimaryColumn()
  token!: string;

  @Field()
  @ManyToOne(() => User, (user) => user.tokens, { eager: true })
  user!: User;
}

export default Token;
