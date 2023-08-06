import { IGenreService } from './types';
import { BookModel, GenreBookRelModel, GenreModel } from '../models';
import { isValidObjectId } from 'mongoose';
import { GenreData } from '../types/models';
import { createMongoObjectIdFromString } from 'src/utils';

class GenreService implements IGenreService {
  async addOne(genreData: GenreData): Promise<GenreData | null> {
    const newGenre = new GenreModel(genreData);

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
    await GenreModel.updateOne({ _id: genreId }, { ...updateData }).session(
      await this.getTransactionSession(),
    );
  }

  async deleteOneById(genreId: GenreData['_id'] | string): Promise<void> {
    this.checkGenreIdValidOrThrowError(genreId);
    await GenreModel.deleteOne({ _id: genreId }).session(
      await this.getTransactionSession(),
    );
  }

  async getAggregatedGenreWithBooksByGenreId(
    genreId: GenreData['_id'] | string,
  ): Promise<GenreData[]> {
    // aggreate match and populate with genres, sort by title asc
    this.checkGenreIdValidOrThrowError(genreId);

    return await GenreModel.aggregate<GenreData>(
      [
        {
          $match: {
            _id: createMongoObjectIdFromString(genreId as string),
          },
        },
        {
          $lookup: {
            from: GenreBookRelModel.collection.name,
            let: { idFromFoundGenre: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundGenre', '$genreId'] },
                },
              },
              {
                $lookup: {
                  from: BookModel.collection.name,
                  let: { foundBookIdFromGBL: '$bookId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$foundBookIdFromGBL'] },
                      },
                    },
                    // {
                    //   $project: {
                    //     _id: 0,
                    //     id: '$_id',
                    //     title: 1,
                    //     description: 1,
                    //     publisher: 1,
                    //     publish_date: 1,
                    //   },
                    // },
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
        // {
        //   $project: {
        //     _id: 1,
        //     __v: 0,
        //   },
        // },
        // {
        //   $addFields: {
        //     id: '$_id',
        //   },
        // },
        // {
        //   $unset: ['_id'],
        // },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getAggregatedGenreWithBooksByGenreName(
    genreName: GenreData['name'],
  ): Promise<GenreData[]> {
    return await GenreModel.aggregate<GenreData>(
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
            from: GenreBookRelModel.collection.name,
            let: { idFromFoundGenre: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundGenre', '$genreId'] },
                },
              },
              {
                $lookup: {
                  from: BookModel.collection.name,
                  let: { foundBookIdFromGBL: '$bookId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$foundBookIdFromGBL'] },
                      },
                    },
                    // {
                    //   $project: {
                    //     _id: 0,
                    //     id: '$_id',
                    //     title: 1,
                    //     description: 1,
                    //     publisher: 1,
                    //     publish_date: 1,
                    //   },
                    // },
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
        // {
        //   $project: {
        //     _id: 1,
        //     __v: 0,
        //   },
        // },
        // {
        //   $addFields: {
        //     id: '$_id',
        //   },
        // },
        // {
        //   $unset: ['_id'],
        // },
      ],
      { session: await this.getTransactionSession() },
    );
  }

  async getTransactionSession() {
    return await GenreModel.startSession();
  }
  checkGenreIdValidOrThrowError(genreId: GenreData['_id'] | string) {
    const genreIdNotValid = !isValidObjectId(genreId);
    if (genreIdNotValid) {
      throw new Error(`GenreService: genreId is not valid.`);
    }
  }
}

export default new GenreService();
