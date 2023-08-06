import { IGenreBookRelService } from './types';
import { GenreBookRelModel } from '../models';
import { isValidObjectId } from 'mongoose';
import { BookData, GenreBookRelData, GenreData } from '../types/models';
import BookService from './Book.Service';
import GenreService from './Genre.Service';
import { createMongoObjectIdFromString } from 'src/utils';

class GenreBookRelService implements IGenreBookRelService {
  async addOne(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<GenreBookRelData> {
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
    return newGBL;
  }

  async deleteGenreBookRel(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void> {
    this.checkIdPairValidOrThrowError(bookId, genreId);

    await GenreBookRelModel.deleteOne({
      bookId: {
        $eq: createMongoObjectIdFromString(bookId as string),
      },
      genreId: {
        $eq: createMongoObjectIdFromString(genreId as string),
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
