import { Resolvers } from '../../types';
import {
  bookByIdResolver,
  bookByTitleResolver,
  bookTypeResolver,
} from './book';
import {
  genreByIdResolver,
  genreByNameResolver,
  genreTypeResolver,
} from './genre';

export const resolvers: Resolvers = {
  Query: {
    bookById: bookByIdResolver,
    bookByTitle: bookByTitleResolver,
    genreById: genreByIdResolver,
    genreByName: genreByNameResolver,
  },
  Book: bookTypeResolver,
  Genre: genreTypeResolver,
};
