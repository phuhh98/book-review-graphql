import {
  BookModel,
  GenreBookRelModel,
  GenreModel,
  ProfileModel,
  UserModel,
} from '../models';
import CBookService from './Book.Service';
import CGenreService from './Genre.Service';
import CGenreBookRelService from './GenreBookRel.Service';
import CUserService from './User.Service';

export const BookService = new CBookService(BookModel, GenreModel, GenreBookRelModel);
export const GenreService = new CGenreService(GenreModel, BookModel, GenreBookRelModel);
export const GenreBookRelService = new CGenreBookRelService(
  GenreBookRelModel,
  GenreModel,
  BookModel,
);

export const UserService = new CUserService(UserModel, ProfileModel);
