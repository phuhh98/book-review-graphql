import { IResolvers, IFieldResolver } from '@graphql-tools/utils';

const helloResolver: IFieldResolver<{}, {}> = () => {
  return 'Hello from graphql';
};

export const resolvers: IResolvers = {
  Query: {
    hello: helloResolver,
  },
};
