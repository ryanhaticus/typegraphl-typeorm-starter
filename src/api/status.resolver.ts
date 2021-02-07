import { Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
class StatusResolver {
  @Query(() => Boolean)
  online() {
    return true;
  }

  @Authorized()
  @Query(() => Boolean)
  authenticated() {
    return true;
  }
}

export default StatusResolver;
