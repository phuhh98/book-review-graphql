import {
  BookFields,
  GeneralFields,
  GenreBookRelFields,
  GenreFields,
} from '../types/constant';

export const ENV = {
  ENV_PROD: 'PROD',
  IS_DOCKER: 'true',
};

export const MODEL_ALIAS = {
  Book: 'Book',
  Genre: 'Genre',
  GenreBookRel: 'GenreBookRel',
};

export const GENERAL_FIELDS: GeneralFields = {
  _id: '_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const BOOK_FIELDS: BookFields & { genres: 'genres' } = {
  ...GENERAL_FIELDS,
  title: 'title',
  description: 'description',
  rating: 'rating',
  publish_date: 'publish_date',
  publisher: 'publisher',
  genres: 'genres',
};

export const GENRE_FIELDS: GenreFields & {
  books: 'books';
} = {
  ...GENERAL_FIELDS,
  name: 'name',
  alias: 'alias',
  description: 'description',
  books: 'books',
};

export const GENRE_BOOK_REL_FIELDS: GenreBookRelFields = {
  bookId: 'bookId',
  genreId: 'genreId',
};
