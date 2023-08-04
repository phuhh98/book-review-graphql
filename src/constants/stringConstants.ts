import {
  BookFields,
  GeneralFields,
  GenreBookRelFields,
  GenreFields,
} from 'src/types/constant';

export const ENV = {
  ENV_PROD: 'PROD',
};

export const MODEL_ALIAS = {
  Book: 'Book',
  Genre: 'Genre',
  GenreBookRel: 'GenreBookRel',
};

export const GENERAL_FIELDS: GeneralFields = {
  id: '_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

export const BOOK_FIELDS: BookFields & { genres: 'genres' } = {
  ...GENERAL_FIELDS,
  title: 'title',
  description: 'description',
  rating: 'rating',
  publish_date: 'publish_date',
  publisher: 'publisher',
  cover_image: 'cover_image',
  genres: 'genres',
};

export const GENRE_FIELDS: GenreFields & {
  books: 'books';
} = {
  ...GENERAL_FIELDS,
  name: 'name',
  books: 'books',
};

export const GENRE_BOOK_REL_FIELDS: GenreBookRelFields = {
  bookId: 'bookId',
  genreId: 'genreId',
};
