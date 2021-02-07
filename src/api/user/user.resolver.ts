import {
  ArgsType,
  Authorized,
  Mutation,
  Query,
  Resolver,
  Field,
  Args,
  Ctx
} from 'type-graphql';
import { Min, Max, Length } from 'class-validator';
import User from './user.entity';

import bcrypt from 'bcrypt';

import { AuthContext } from '../graphql.authentication';

@ArgsType()
class UserCreateArgs {
  @Field(() => String)
  @Length(5, 40)
  email!: string;

  @Field(() => String)
  @Length(6, 30)
  password!: string;
}

@Resolver()
class UserResolver {
  @Mutation(() => User)
  async userCreate(@Args() { email, password }: UserCreateArgs) {
    const _user = await User.findOne({
      where: {
        email
      }
    });
    if (_user) {
      throw 'The provided email address is already in use.';
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.create({
      email,
      passwordHash: hash
    }).save();
    return user.sanitize();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async userDelete(@Ctx() ctx: AuthContext) {
    await ctx.user?.remove();
    return true;
  }
}

export default UserResolver;
