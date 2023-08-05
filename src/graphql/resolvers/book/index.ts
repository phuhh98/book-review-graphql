import BookService from '../../../services/Book.Service';
import GenreService from '../../../services/Genre.Service';
import { BookResolvers, QueryResolvers } from '../../../types';

export const bookByTitleResolver: QueryResolvers['bookByTitle'] = async (
  _,
  args,
) => {
  return await BookService.getOneByTitle(args.title as string);
};

export const bookByIdResolver: QueryResolvers['bookById'] = async (_, args) => {
  return args.id ? await BookService.getOneById(args.id) : null;
};

export const bookTypeResolver: BookResolvers = {
  title: (parent) => parent.title,
  description: (parent) => parent.description ?? null,
  rating: (parent) => parent.rating ?? null,
  publish_date: (parent) => parent.publish_date,
  publisher: (parent) => parent.publisher ?? null,
  genres: async (parent) => {
    if (!parent.genres) {
      return [];
    }
    const genres = await Promise.all(
      parent.genres?.map(async (genre) =>
        genre === null ? null : await GenreService.getOneById(genre._id),
      ),
    );
    return genres;
  },
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};
