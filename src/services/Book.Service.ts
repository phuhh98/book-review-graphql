import { Book, Maybe } from 'src/types';
import { IBookService } from './types';
import { BookModel, GenreBookRelModel, GenreModel } from 'src/models';
import mongoose from 'mongoose';

class BookService implements IBookService {
  async addOne(bookData: Book): Promise<Book | null> {
    const newBook = new BookModel(bookData);

    await newBook.save({ session: await this.getTransactionSession() });

    return newBook;
  }

  async getOneById(bookId: Maybe<string> | undefined): Promise<Book | null> {
    const bookAggregateResult = await this.getAggregatedBookWithGenresById(
      bookId,
    );

    return bookAggregateResult[0];
  }

  async getOneByTitle(bookTitle: string): Promise<Book | null> {
    const bookAggregateResult = await this.getAggregatedBookWithGenresByTitle(
      bookTitle,
    );
    return bookAggregateResult[0];
  }

  async updateOneById(
    bookId: Maybe<string> | undefined,
    updateData: Book,
  ): Promise<void> {
    await BookModel.updateOne({ _id: bookId }, { ...updateData }).session(
      await this.getTransactionSession(),
    );
  }

  async deleteOneById(bookId: Maybe<string> | undefined): Promise<void> {
    await BookModel.deleteOne({ _id: bookId }).session(
      await this.getTransactionSession(),
    );
  }

  async getTransactionSession() {
    return await BookModel.startSession();
  }

  async getAggregatedBookWithGenresById(bookId: Book['id']): Promise<Book[]> {
    return await BookModel.aggregate<Book>(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(bookId as string),
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
                      $project: {
                        _id: 1,
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
          $project: {
            _id: 1,
            __v: 0,
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getAggregatedBookWithGenresByTitle(
    bookTitle: Book['title'],
  ): Promise<Book[]> {
    return await BookModel.aggregate<Book>(
      [
        {
          $match: {
            title: {
              $in: [new RegExp(`${bookTitle}`, 'i')],
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
                      $project: {
                        _id: 1,
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
          $project: {
            _id: 1,
            __v: 0,
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }
}

export default new BookService();
