import { Resolvers } from 'src/types';
import {
  addGenreToBookResolver,
  bookByIdResolver,
  booksByTitleResolver,
  bookTypeResolver,
  createBookResolver,
} from './book';
import {
  createGenreResolver,
  genreByIdResolver,
  genresByNameResolver,
  genreTypeResolver,
  removeBookFromGenreResolver,
} from './genre';

export const resolvers: Resolvers = {
  Query: {
    bookById: bookByIdResolver,
    booksByTitle: booksByTitleResolver,
    genreById: genreByIdResolver,
    genresByName: genresByNameResolver,
  },
  Mutation: {
    createBook: createBookResolver,
    createGenre: createGenreResolver,
    addGenreToBook: addGenreToBookResolver,
    removeBookFromGenre: removeBookFromGenreResolver,
  },
  Book: bookTypeResolver,
  Genre: genreTypeResolver,
};
