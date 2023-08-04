import { Book, Genre } from 'src/types';
import { GenreBookRel } from 'src/types/constant';

export interface IGenreBookRelService {
  addOne(bookId: Book['id'], genreId: Genre['id']): Promise<GenreBookRel>;
  deleteGenreBookRel(bookId: Book['id'], genreId: Genre['id']): Promise<void>;
}
