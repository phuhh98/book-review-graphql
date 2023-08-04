import { Book, Genre } from './resolverTypes';

export type GenreBookRel = {
  bookId: unknown;
  genreId: unknown;
};

type OmitGraphTypeName<T> = Exclude<T, '__typename'>;
type Replace_id<T> = Exclude<T, 'id'> | '_id';

type GeneralKeys = OmitGraphTypeName<Extract<GenreKeys, BookKeys>>;
type GenreKeys = OmitGraphTypeName<keyof Genre>;
type BookKeys = OmitGraphTypeName<keyof Book>;
type GenreBookRelKeys = OmitGraphTypeName<keyof GenreBookRel>;

export type GeneralFields = Required<
  Record<GeneralKeys, Replace_id<GeneralKeys>>
>;
export type GenreFields = Required<Record<GenreKeys, Replace_id<GenreKeys>>>;
export type BookFields = Required<Record<BookKeys, Replace_id<BookKeys>>>;
export type GenreBookRelFields = Required<
  Record<GenreBookRelKeys, GenreBookRelKeys>
>;
