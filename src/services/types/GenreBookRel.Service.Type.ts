import { BookData, GenreBookRelData, GenreData } from '../../types/models';

export interface IGenreBookRelService {
  addOne(bookId: BookData['_id'] | string, genreId: GenreData['_id'] | string): Promise<GenreBookRelData>;
  deleteGenreBookRel(bookId: BookData['_id'] | string, genreId: GenreData['_id'] | string): Promise<void>;
}
