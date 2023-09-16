import { Resolvers } from '../../types';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { bookMutationResolvers, bookQueryResolvers, bookTypeResolver } from './book';
import { genreMutationResolvers, genreQueryResolvers, genreTypeResolver } from './genre';
import { userMutationResolvers, userQueryResolvers, userTypeResolver } from './user';

export const resolvers: Resolvers = {
  Query: {
    ...bookQueryResolvers,
    ...genreQueryResolvers,
    ...userQueryResolvers,
  },
  Mutation: {
    ...bookMutationResolvers,
    ...genreMutationResolvers,
    ...userMutationResolvers,
  },
  Book: bookTypeResolver,
  Genre: genreTypeResolver,
  User: userTypeResolver,
  Upload: GraphQLUpload,
};
