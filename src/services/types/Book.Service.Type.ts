import { Book } from 'src/types';

export interface IBookService {
  addOne(bookData: Book): Promise<Book | null>;
  getOneById(bookId: Book['id']): Promise<Book | null>;
  getOneByTitle(bookTitle: Book['title']): Promise<Book | null>;
  updateOneById(bookId: Book['id'], updateData: Book): Promise<void>;
  deleteOneById(bookId: Book['id']): Promise<void>;
}
