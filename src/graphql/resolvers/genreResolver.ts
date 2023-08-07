import BookService from 'src/services/Book.Service';
import { GenreResolvers } from 'src/types';

// Genre type field resolvers
export const genreResolver: GenreResolvers = {
  id: (parent) => parent._id.toString(),
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
