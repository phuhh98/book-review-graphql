import { GenreBookRel } from 'src/types/constant';
import { IGenreBookRelService } from './types';
import { GenreBookRelModel } from 'src/models';
import { Maybe } from 'src/types';

class GenreBookRelService implements IGenreBookRelService {
  async addOne(
    bookId: Maybe<string> | undefined,
    genreId: Maybe<string> | undefined,
  ): Promise<GenreBookRel> {
    return (await GenreBookRelModel.create({ bookId, genreId })).save({
      session: await this.getTransactionSession(),
    });
  }

  async deleteGenreBookRel(
    bookId: Maybe<string> | undefined,
    genreId: Maybe<string> | undefined,
  ): Promise<void> {
    await GenreBookRelModel.deleteOne({
      $expr: {
        bookId: {
          $eq: bookId,
        },
        genreId: {
          $eq: genreId,
        },
      },
    });
  }

  async getTransactionSession() {
    return await GenreBookRelModel.startSession();
  }
}

export default new GenreBookRelService();
