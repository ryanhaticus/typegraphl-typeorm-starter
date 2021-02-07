import {
  Args,
  Mutation,
  Resolver,
  ArgsType,
  Field,
  Authorized
} from 'type-graphql';
import User from '../user/user.entity';
import * as crypto from 'crypto';
import Token from './token.entity';
import bcrypt from 'bcrypt';

@ArgsType()
class TokenCreateArgs {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ArgsType()
class TokenDeleteArgs {
  @Field(() => String)
  token!: string;
}

@Resolver()
class TokenResolver {
  @Mutation(() => Token)
  async tokenCreate(@Args() { email, password }: TokenCreateArgs) {
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      throw 'The provided email address is not in use.';
    }
    if (!bcrypt.compareSync(password, user.passwordHash)) {
      throw 'The provided password is not valid.';
    }
    const _token = crypto.randomBytes(48).toString('hex');
    const token = await Token.create({
      token: _token,
      user
    }).save();
    return token;
  }

  @Mutation(() => Boolean)
  @Authorized()
  async tokenDelete(@Args() { token }: TokenDeleteArgs) {
    const _token = await Token.findOne({
      where: {
        token
      }
    });
    if (!_token) {
      throw 'An error occurred while deleting the token.';
    }
    await _token.remove();
    return true;
  }
}
