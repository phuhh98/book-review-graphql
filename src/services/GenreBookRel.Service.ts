import { BookData, GenreBookRelData, GenreData } from '../types';
import { Model, Types, isValidObjectId } from 'mongoose';
import { createMongoObjectIdFromString } from '../utils';

export default class GenreBookRelService {
  constructor(
    private GBLModel: Model<GenreBookRelData>,
    private genreModel: Model<GenreData>,
    private bookModel: Model<BookData>,
  ) {}
  async addOne(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<GenreBookRelData> {
    this.checkIdPairValidOrThrowError(bookId, genreId);

    const book = await this.bookModel.findOne({ _id: new Types.ObjectId(bookId) });
    const genre = await this.genreModel.findOne({ _id: new Types.ObjectId(genreId) });

    if (!book) {
      throw new Error('book not found');
    }
    if (!genre) {
      throw new Error('genre not found');
    }

    const newGBL = new this.GBLModel({ bookId, genreId });
    await newGBL.save({ session: await this.getTransactionSession() });
    return newGBL;
  }

  async deleteGenreBookRel(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void> {
    this.checkIdPairValidOrThrowError(bookId, genreId);

    await this.GBLModel.deleteOne({
      bookId: {
        $eq: createMongoObjectIdFromString(bookId as string),
      },
      genreId: {
        $eq: createMongoObjectIdFromString(genreId as string),
      },
    });
  }

  async getTransactionSession() {
    return await this.GBLModel.startSession();
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
