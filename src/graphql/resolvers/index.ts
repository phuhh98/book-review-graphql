import { Resolvers } from 'src/types';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { bookMutationResolvers, bookQueryResolvers, bookTypeResolver } from './book';
import { genreMutationResolvers, genreQueryResolvers, genreTypeResolver } from './genre';

export const resolvers: Resolvers = {
  Query: {
    ...bookQueryResolvers,
    ...genreQueryResolvers,
  },
  Mutation: {
    ...bookMutationResolvers,
    ...genreMutationResolvers,
  },
  Book: bookTypeResolver,
  Genre: genreTypeResolver,
  Upload: GraphQLUpload,
};
