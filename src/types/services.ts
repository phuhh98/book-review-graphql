import {
  AuthorData,
  AuthorDataAfterPopulated,
  BookData,
  GenreBookRelData,
  GenreData,
  UserData,
  UserDataAfterPopulated,
} from './data';

export abstract class IBookService {
  abstract addOne(bookData: BookData): Promise<BookData | null>;
  abstract getOneById(bookId: BookData['_id'] | string): Promise<BookData | null>;
  abstract getOneByTitle(bookTitle: BookData['title']): Promise<BookData | null>;
  abstract updateOneById(
    bookId: BookData['_id'] | string,
    updateData: BookData,
  ): Promise<void>;
  abstract deleteOneById(bookId: BookData['_id'] | string): Promise<void>;
  abstract getBooksWithTitle(bookTitle: BookData['title']): Promise<BookData[] | []>;
}

export abstract class IGenreService {
  abstract addOne(genreData: GenreData): Promise<GenreData | null>;
  abstract getOneById(genreId: GenreData['_id'] | string): Promise<GenreData | null>;
  abstract getOneByName(genreName: GenreData['name']): Promise<GenreData | null>;
  abstract updateOneById(
    genreId: GenreData['_id'] | string,
    updateData: GenreData,
  ): Promise<void>;
  abstract deleteOneById(genreId: GenreData['_id'] | string): Promise<void>;
  abstract getGenresWithName(genreName: GenreData['name']): Promise<GenreData[] | []>;
}

export abstract class IGenreBookRelService {
  abstract addOne(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<GenreBookRelData>;
  abstract deleteGenreBookRel(
    bookId: BookData['_id'] | string,
    genreId: GenreData['_id'] | string,
  ): Promise<void>;
}

export abstract class IUserService {
  abstract addOne(
    userData: UserDataAfterPopulated,
  ): Promise<UserDataAfterPopulated | null>;
  abstract getOneById(
    userId: UserData['_id'] | string,
  ): Promise<UserDataAfterPopulated | null>;
  abstract updateProfileById(
    userId: UserData['_id'] | string,
    profileData: UserDataAfterPopulated['profile'],
  ): Promise<UserDataAfterPopulated | null>;
}

export abstract class IAuthorService {
  abstract addOne(authorData: AuthorDataAfterPopulated): Promise<AuthorData | null>;
  abstract getOneById(authorId: AuthorData['_id'] | string): Promise<AuthorData | null>;
  abstract updateOneById(
    authorId: AuthorData['_id'] | string,
    updateData: AuthorDataAfterPopulated,
  ): Promise<void>;
}
