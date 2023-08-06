import { GenreData } from '../../types/models';

export interface IGenreService {
  addOne(genreData: GenreData): Promise<GenreData | null>;
  getOneById(genreId: GenreData['_id'] | string): Promise<GenreData | null>;
  getOneByName(genreName: GenreData['name'] | string): Promise<GenreData | null>;
  updateOneById(genreId: GenreData['_id'] | string, updateData: GenreData): Promise<void>;
  deleteOneById(genreId: GenreData['_id'] | string): Promise<void>;
  getGenresWithName(genreName: GenreData['name'] | string): Promise<GenreData[] | []>;
}
