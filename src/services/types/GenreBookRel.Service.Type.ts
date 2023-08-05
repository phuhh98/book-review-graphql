import { BookData, GenreData } from '../../types/models';

export interface IGenreBookRelService {
  addOne(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void>;
  deleteGenreBookRel(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void>;
}
