import { AuthChecker } from 'type-graphql';
import { ExpressContext } from 'apollo-server-express';
import Token from './token/token.entity';
import User from './user/user.entity';

interface AuthContext {
  user?: User;
}

const authChecker: AuthChecker<AuthContext> = async (
  { root, args, context },
  roles
) => {
  return context.user != null;
};

const authContext = async ({ req }: ExpressContext) => {
  const _token = req.headers.authorization;
  if (!_token) {
    return {};
  }
  const token = await Token.findOne({
    where: {
      token: _token
    }
  });
  if (!token) {
    return {};
  }
  return { user: token.user };
};

export { authChecker, authContext, AuthContext };
