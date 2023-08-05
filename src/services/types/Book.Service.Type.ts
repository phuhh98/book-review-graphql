import { BookData } from '../../types/models';

export interface IBookService {
  addOne(bookData: BookData): Promise<BookData | null>;
  getOneById(bookId: BookData['_id'] | string): Promise<BookData | null>;
  getOneByTitle(
    bookTitle: BookData['title'] | string,
  ): Promise<BookData | null>;
  updateOneById(
    bookId: BookData['_id'] | string,
    updateData: BookData,
  ): Promise<void>;
  deleteOneById(bookId: BookData['_id'] | string): Promise<void>;
}
