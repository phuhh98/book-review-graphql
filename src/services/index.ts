import { BookModel, GenreBookRelModel, GenreModel } from 'src/models';
import CBookService from './Book.Service';
import CGenreService from './Genre.Service';
import CGenreBookRelService from './GenreBookRel.Service';

export const BookService = new CBookService(BookModel, GenreModel, GenreBookRelModel);
export const GenreService = new CGenreService(GenreModel, BookModel, GenreBookRelModel);
export const GenreBookRelService = new CGenreBookRelService(
  GenreBookRelModel,
  GenreModel,
  BookModel,
);
