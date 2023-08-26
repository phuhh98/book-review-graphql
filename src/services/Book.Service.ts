import { IBookService, BookData, GenreData, GenreBookRelData } from '../types';
import { Model, isValidObjectId } from 'mongoose';
import { createMongoObjectIdFromString } from '../utils';
import escapeStringRegexp from 'escape-string-regexp';

export default class BookService implements IBookService {
  constructor(
    private bookModel: Model<BookData>,
    private genreModel: Model<GenreData>,
    private GBLModel: Model<GenreBookRelData>,
  ) {}

  async addOne(bookData: BookData): Promise<BookData | null> {
    const newBook = new this.bookModel(bookData);

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

    await this.bookModel
      .updateOne(
        { _id: createMongoObjectIdFromString(bookId.toString()) },
        { ...updateData },
        { runValidators: true },
      )
      .session(await this.getTransactionSession());
  }

  async deleteOneById(bookId: BookData['_id'] | string): Promise<void> {
    this.checkBookIdValidOrThrowError(bookId);

    await this.bookModel
      .deleteOne({
        _id: createMongoObjectIdFromString(bookId.toString()),
      })
      .session(await this.getTransactionSession());
  }

  async getTransactionSession() {
    return await this.bookModel.startSession();
  }

  async getAggregatedBookWithGenresById(
    bookId: BookData['_id'] | string,
  ): Promise<BookData[]> {
    // aggreate match and populate with genres, sort by title asc
    this.checkBookIdValidOrThrowError(bookId);

    return await this.bookModel.aggregate<BookData>(
      [
        {
          $match: {
            _id: createMongoObjectIdFromString(bookId as string),
          },
        },
        {
          $lookup: {
            from: this.GBLModel.collection.name,
            let: { idFromFoundBook: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundBook', '$bookId'] },
                },
              },
              {
                $lookup: {
                  from: this.genreModel.collection.name,
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

    return await this.bookModel.aggregate<BookData>(
      [
        {
          $match: {
            title: {
              $regex: new RegExp(escapeStringRegexp(bookTitle)),
              $options: 'i',
            },
          },
        },
        {
          $lookup: {
            from: this.GBLModel.collection.name,
            let: { idFromFoundBook: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundBook', '$bookId'] },
                },
              },
              {
                $lookup: {
                  from: this.genreModel.collection.name,
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

  async getLastestBooks(maxItems?: number | string, offset?: number | string) {
    const DEFAULT_MAX_ITEMS = 10;
    const DEAFAULT_OFFSET = 0;
    maxItems = maxItems
      ? parseInt(maxItems.toString()) ?? DEFAULT_MAX_ITEMS
      : DEFAULT_MAX_ITEMS;
    offset = offset ? parseInt(offset.toString()) ?? DEAFAULT_OFFSET : DEAFAULT_OFFSET;

    const books = await this.bookModel.find(
      {},
      {},
      { sort: { publish_date: 'desc' }, limit: maxItems, skip: offset },
    );
    return books;
  }

  checkBookIdValidOrThrowError(bookId: BookData['_id'] | string) {
    const genreIdNotValid = !isValidObjectId(bookId);
    if (genreIdNotValid) {
      throw new Error(`BookService: genreId is not valid.`);
    }
  }
}
