import { Resolvers } from 'src/types';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { queryResolver } from './queryResolver';
import { mutationResolver } from './mutationResolver';
import { bookResolver } from './bookResolver';
import { genreResolver } from './genreResolver';

export const resolvers: Resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Book: bookResolver,
  Genre: genreResolver,
  Upload: GraphQLUpload,
};
