import { IBookService } from './types';
import { BookModel, GenreBookRelModel, GenreModel } from '../models';
import { isValidObjectId } from 'mongoose';
import { BookData } from '../types/models';
import { createMongoObjectIdFromString } from 'src/utils';

class BookService implements IBookService {
  async addOne(bookData: BookData): Promise<BookData | null> {
    const newBook = new BookModel(bookData);

    await newBook.save({ session: await this.getTransactionSession() });

    return newBook;
  }

  async getOneById(bookId: BookData['_id'] | string): Promise<BookData | null> {
    this.checkBookIdValidOrThrowError(bookId);

    const bookAggregateResult = await this.getAggregatedBookWithGenresById(bookId);

    return bookAggregateResult.length !== 0 ? bookAggregateResult[0] : null;
  }

  async getOneByTitle(bookTitle: BookData['title']): Promise<BookData | null> {
    const bookAggregateResult = await this.getAggregatedBookWithGenresByTitle(bookTitle);
    return bookAggregateResult.length !== 0 ? bookAggregateResult[0] : null;
  }

  async getBooksWithTitle(bookTitle: string): Promise<BookData[] | []> {
    const bookAggregateResult = await this.getAggregatedBookWithGenresByTitle(bookTitle);

    return bookAggregateResult;
  }

  async updateOneById(
    bookId: BookData['_id'] | string,
    updateData: BookData,
  ): Promise<void> {
    this.checkBookIdValidOrThrowError(bookId);

    await BookModel.updateOne(
      { _id: createMongoObjectIdFromString(bookId.toString()) },
      { ...updateData },
    ).session(await this.getTransactionSession());
  }

  async deleteOneById(bookId: BookData['_id'] | string): Promise<void> {
    this.checkBookIdValidOrThrowError(bookId);

    await BookModel.deleteOne({
      _id: createMongoObjectIdFromString(bookId.toString()),
    }).session(await this.getTransactionSession());
  }

  async getTransactionSession() {
    return await BookModel.startSession();
  }

  async getAggregatedBookWithGenresById(
    bookId: BookData['_id'] | string,
  ): Promise<BookData[]> {
    // aggreate match and populate with genres, sort by title asc
    this.checkBookIdValidOrThrowError(bookId);

    return await BookModel.aggregate<BookData>(
      [
        {
          $match: {
            _id: createMongoObjectIdFromString(bookId as string),
          },
        },
        {
          $lookup: {
            from: GenreBookRelModel.collection.name,
            let: { idFromFoundBook: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundBook', '$bookId'] },
                },
              },
              {
                $lookup: {
                  from: GenreModel.collection.name,
                  let: { genreIdFromGBL: '$genreId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$genreIdFromGBL'] },
                      },
                    },
                    {
                      $sort: {
                        name: 1,
                      },
                    },
                  ],
                  as: 'genreNodeFromGenre',
                },
              },
              { $unwind: '$genreNodeFromGenre' },
              {
                $replaceRoot: {
                  newRoot: '$genreNodeFromGenre',
                },
              },
            ],
            as: 'genres',
          },
        },
        {
          $sort: {
            title: 1,
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getAggregatedBookWithGenresByTitle(
    bookTitle: BookData['title'],
  ): Promise<BookData[]> {
    // aggreate match and populate with genres, sort by title asc

    return await BookModel.aggregate<BookData>(
      [
        {
          $match: {
            title: {
              $regex: `${bookTitle}`,
              $options: 'i',
            },
          },
        },
        {
          $lookup: {
            from: GenreBookRelModel.collection.name,
            let: { idFromFoundBook: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundBook', '$bookId'] },
                },
              },
              {
                $lookup: {
                  from: GenreModel.collection.name,
                  let: { genreIdFromGBL: '$genreId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$genreIdFromGBL'] },
                      },
                    },
                    {
                      $sort: {
                        name: 1,
                      },
                    },
                  ],
                  as: 'genreNodeFromGenre',
                },
              },
              { $unwind: '$genreNodeFromGenre' },
              {
                $replaceRoot: {
                  newRoot: '$genreNodeFromGenre',
                },
              },
            ],
            as: 'genres',
          },
        },
        {
          $sort: {
            title: 1,
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  checkBookIdValidOrThrowError(bookId: BookData['_id'] | string) {
    const genreIdNotValid = !isValidObjectId(bookId);
    if (genreIdNotValid) {
      throw new Error(`BookService: genreId is not valid.`);
    }
  }
}

export default new BookService();
