import { Genre } from 'src/types';

export interface IGenreService {
  addOne(bookData: Genre): Promise<Genre | null>;
  getOneById(bookId: Genre['id']): Promise<Genre | null>;
  getOneByName(bookTitle: Genre['name']): Promise<Genre | null>;
  updateOneById(bookId: Genre['id'], updateData: Genre): Promise<void>;
  deleteOneById(bookId: Genre['id']): Promise<void>;
}
