import 'reflect-metadata';

import { authChecker, authContext } from './api/graphql.authentication';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

(async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [`${__dirname}/api/**/*.resolver.ts`],
    authChecker
  });

  const apolloServer = new ApolloServer({
    schema,
    context: authContext
  });

  const app = express();
  apolloServer.applyMiddleware({ app });

  app.listen(
    process.env.NODE_ENV == 'dev'
      ? process.env.EXPRESS_DEV_PORT
      : process.env.EXPRESS_LIVE_PORT,
    () => {
      console.info('Server is live!');
    }
  );
})();
