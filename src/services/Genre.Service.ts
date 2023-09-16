import { GenreData, BookData, GenreBookRelData } from '../types';
import { Model, isValidObjectId } from 'mongoose';
import { createMongoObjectIdFromString } from '../utils';

export default class GenreService {
  constructor(
    private genreModel: Model<GenreData>,
    private bookModel: Model<BookData>,
    private GBLModel: Model<GenreBookRelData>,
  ) {}

  async addOne(genreData: GenreData): Promise<GenreData | null> {
    const newGenre = new this.genreModel(genreData);

    await newGenre.save({ session: await this.getTransactionSession() });

    return newGenre;
  }

  async getOneById(genreId: GenreData['_id'] | string): Promise<GenreData | null> {
    this.checkGenreIdValidOrThrowError(genreId);
    const genreAggregatedResult = await this.getAggregatedGenreWithBooksByGenreId(
      genreId,
    );

    return genreAggregatedResult.length !== 0 ? genreAggregatedResult[0] : null;
  }

  async getOneByName(genreName: GenreData['name']): Promise<GenreData | null> {
    const genreAggregatedResult = await this.getAggregatedGenreWithBooksByGenreName(
      genreName,
    );

    return genreAggregatedResult.length !== 0 ? genreAggregatedResult[0] : null;
  }

  async getGenresWithName(genreName: string): Promise<GenreData[] | []> {
    const genreAggregatedResult = await this.getAggregatedGenreWithBooksByGenreName(
      genreName,
    );

    return genreAggregatedResult;
  }

  async updateOneById(
    genreId: GenreData['_id'] | string,
    updateData: GenreData,
  ): Promise<void> {
    this.checkGenreIdValidOrThrowError(genreId);
    await this.genreModel
      .updateOne(
        { _id: createMongoObjectIdFromString(genreId.toString()) },
        { ...updateData },
        { runValidators: true },
      )
      .session(await this.getTransactionSession());
  }

  async deleteOneById(genreId: GenreData['_id'] | string): Promise<void> {
    this.checkGenreIdValidOrThrowError(genreId);
    await this.genreModel
      .deleteOne({
        _id: createMongoObjectIdFromString(genreId.toString()),
      })
      .session(await this.getTransactionSession());
  }

  async getAggregatedGenreWithBooksByGenreId(
    genreId: GenreData['_id'] | string,
  ): Promise<GenreData[]> {
    // aggreate match and populate with genres, sort by title asc
    this.checkGenreIdValidOrThrowError(genreId);

    return await this.genreModel.aggregate<GenreData>(
      [
        {
          $match: {
            _id: createMongoObjectIdFromString(genreId as string),
          },
        },
        {
          $lookup: {
            from: this.GBLModel.collection.name,
            let: { idFromFoundGenre: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundGenre', '$genreId'] },
                },
              },
              {
                $lookup: {
                  from: this.bookModel.collection.name,
                  let: { foundBookIdFromGBL: '$bookId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$foundBookIdFromGBL'] },
                      },
                    },
                  ],
                  as: 'bookNodeFromBook',
                },
              },
              { $unwind: '$bookNodeFromBook' },
              {
                $replaceRoot: {
                  newRoot: '$bookNodeFromBook',
                },
              },
            ],
            as: 'books',
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getAggregatedGenreWithBooksByGenreName(
    genreName: GenreData['name'],
  ): Promise<GenreData[]> {
    return await this.genreModel.aggregate<GenreData>(
      [
        {
          $match: {
            name: {
              $regex: `${genreName}`,
              $options: 'i',
            },
          },
        },
        {
          $lookup: {
            from: this.GBLModel.collection.name,
            let: { idFromFoundGenre: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundGenre', '$genreId'] },
                },
              },
              {
                $lookup: {
                  from: this.bookModel.collection.name,
                  let: { foundBookIdFromGBL: '$bookId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$foundBookIdFromGBL'] },
                      },
                    },
                    {
                      $sort: {
                        name: 1,
                      },
                    },
                  ],
                  as: 'bookNodeFromBook',
                },
              },
              { $unwind: '$bookNodeFromBook' },
              {
                $replaceRoot: {
                  newRoot: '$bookNodeFromBook',
                },
              },
            ],
            as: 'books',
          },
        },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getTransactionSession() {
    return await this.genreModel.startSession();
  }
  checkGenreIdValidOrThrowError(genreId: GenreData['_id'] | string) {
    const genreIdNotValid = !isValidObjectId(genreId);
    if (genreIdNotValid) {
      throw new Error(`GenreService: genreId is not valid.`);
    }
  }
}
