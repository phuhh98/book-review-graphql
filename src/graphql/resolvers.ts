import { IResolvers, IFieldResolver } from '@graphql-tools/utils';

const helloResolver: IFieldResolver<
  Record<string, undefined>,
  Record<string, unknown>
> = () => {
  return 'Hello from graphql';
};

export const resolvers: IResolvers = {
  Query: {
    hello: helloResolver,
  },
};
