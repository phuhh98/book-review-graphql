import { Resolvers } from 'src/types';
import {
  addGenreToBookResolver,
  bookByIdResolver,
  booksByTitleResolver,
  bookTypeResolver,
  createBookResolver,
  uploadImageResolver,
} from './book';
import {
  createGenreResolver,
  genreByIdResolver,
  genresByNameResolver,
  genreTypeResolver,
  removeBookFromGenreResolver,
} from './genre';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

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
    uploadBookCoverImage: uploadImageResolver,
  },
  Book: bookTypeResolver,
  Genre: genreTypeResolver,
  Upload: GraphQLUpload,
};
