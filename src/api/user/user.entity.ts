import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import Token from '../token/token.entity';

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  passwordHash!: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens!: Token[];

  sanitize() {
    const { id, email } = this;
    return {
      id,
      email
    };
  }
}

export default User;
