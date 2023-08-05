import { IGenreBookRelService } from './types';
import { GenreBookRelModel } from '../models';
import mongoose, { isValidObjectId } from 'mongoose';
import { GENRE_BOOK_REL_FIELDS } from '../constants';
import { BookData, GenreData } from '../types/models';
import BookService from './Book.Service';
import GenreService from './Genre.Service';

class GenreBookRelService implements IGenreBookRelService {
  async addOne(
    bookId: BookData['_id'] | string,
    genreId: BookData['_id'] | string,
  ): Promise<void> {
    this.checkIdPairValidOrThrowError(bookId, genreId);

    const book = await BookService.getOneById(bookId);
    const genre = await GenreService.getOneById(genreId);

    if (!book) {
      throw new Error('book not found');
    }
    if (!genre) {
      throw new Error('genre not found');
    }

    const newGBL = new GenreBookRelModel({ bookId, genreId });
    await newGBL.save({ session: await this.getTransactionSession() });
  }

  async deleteGenreBookRel(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void> {
    this.checkIdPairValidOrThrowError(bookId, genreId);

    await GenreBookRelModel.deleteOne({
      [GENRE_BOOK_REL_FIELDS.bookId]: {
        $eq: new mongoose.Types.ObjectId(bookId as string),
      },
      [GENRE_BOOK_REL_FIELDS.genreId]: {
        $eq: new mongoose.Types.ObjectId(genreId as string),
      },
    });
  }

  async getTransactionSession() {
    return await GenreBookRelModel.startSession();
  }

  checkIdPairValidOrThrowError(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): void {
    const bookIdNotValid = !isValidObjectId(bookId);
    const genreIdNotValid = !isValidObjectId(genreId);
    if (bookIdNotValid || genreIdNotValid)
      throw new Error(
        `GenreBookRelService: Input ${bookIdNotValid ? 'bookId' : ''}${
          bookIdNotValid && genreIdNotValid ? ' and ' : ''
        }${genreIdNotValid ? 'genreId' : ''} is invalid`,
      );
  }
}

export default new GenreBookRelService();
