import { IObjectTypeResolver } from '@graphql-tools/utils';
import BookService from '../../../services/Book.Service';
import GenreService from '../../../services/Genre.Service';
import { GenreResolvers, QueryResolvers } from '../../../types';

export const genreByNameResolver: QueryResolvers['genreByName'] = async (
  _,
  args,
) => {
  return await GenreService.getOneByName(args.name as string);
};

export const genreByIdResolver: QueryResolvers['genreById'] = async (
  _,
  args,
) => {
  return await GenreService.getOneById(args.id as string);
};

export const genreTypeResolver: GenreResolvers = {
  name: (parent) => parent.name,
  description: (parent) => parent.description,
  books: async (parent) => {
    if (!parent.books) {
      return [];
    }
    const books = await Promise.all(
      parent.books?.map(async (book) =>
        book === null ? null : await BookService.getOneById(book._id),
      ),
    );
    return books;
  },
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};
