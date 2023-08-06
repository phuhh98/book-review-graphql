import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { BookData, GenreBookRelData } from 'src/types/models';
import BookService from 'src/services/Book.Service';
import GenreService from 'src/services/Genre.Service';
import { BookResolvers, MutationResolvers, QueryResolvers } from 'src/types';
import GenreBookRelService from 'src/services/GenreBookRel.Service';

// Book type field resovlers
export const bookTypeResolver: BookResolvers = {
  id: (parent) => parent._id.toString(),
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
      parent.genres?.map(async (genre) => (genre === null ? null : await GenreService.getOneById(genre._id))),
    );
    return genres;
  },
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};

// Queries
export const booksByTitleResolver: QueryResolvers['booksByTitle'] = async (_, args) => {
  const book = await BookService.getBooksWithTitle(args.title as string);

  if (book.length === 0) {
    throw new GraphQLError(`Book includes title "${args.title}" not found`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.NOT_FOUND),
      },
    });
  }

  return book;
};

export const bookByIdResolver: QueryResolvers['bookById'] = async (_, args) => {
  const book = await BookService.getOneById(args.id);

  if (book === null)
    throw new GraphQLError(`Book with id "${args.id}" does not exist`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.NOT_FOUND),
      },
    });

  return book;
};

// Mutations
export const createBookResolver: MutationResolvers['createBook'] = async (_, args) => {
  let newBook: BookData | null;
  try {
    newBook = await BookService.addOne(args as BookData);
    if (newBook === null) throw new Error('Can not create book');
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }
  return newBook;
};

export const addGenreToBookResolver: MutationResolvers['addGenreToBook'] = async (_, args) => {
  let newGBL: GenreBookRelData;
  try {
    newGBL = await GenreBookRelService.addOne(args.bookId, args.genreId);
  } catch (err) {
    throw new GraphQLError((err as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }

  const book = await BookService.getOneById(args.bookId);

  if (book === null)
    throw new GraphQLError(`Can not add genre "${args.genreId}" to book "${args.bookId}". Book not found`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.BAD_REQUEST),
      },
    });

  return book;
};
