import { Genre, Maybe } from 'src/types';
import { IGenreService } from './types';
import { GenreModel } from 'src/models';

class GenreService implements IGenreService {
  async addOne(bookData: Genre): Promise<Genre | null> {
    const newGenre = new GenreModel(bookData);

    await newGenre.save({ session: await this.getTransactionSession() });

    return newGenre;
  }

  async getOneById(bookId: Maybe<string> | undefined): Promise<Genre | null> {
    return await GenreModel.findOne({ _id: bookId }).session(
      await this.getTransactionSession(),
    );
  }

  async getOneByName(bookTitle: string): Promise<Genre | null> {
    return await GenreModel.findOne({ title: bookTitle }).session(
      await this.getTransactionSession(),
    );
  }

  async updateOneById(
    bookId: Maybe<string> | undefined,
    updateData: Genre,
  ): Promise<void> {
    await GenreModel.updateOne({ _id: bookId }, { ...updateData }).session(
      await this.getTransactionSession(),
    );
  }

  async deleteOneById(bookId: Maybe<string> | undefined): Promise<void> {
    await GenreModel.deleteOne({ _id: bookId }).session(
      await this.getTransactionSession(),
    );
  }

  async getTransactionSession() {
    return await GenreModel.startSession();
  }
}

export default new GenreService();
