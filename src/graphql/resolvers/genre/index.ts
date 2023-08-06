import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import BookService from 'src/services/Book.Service';
import GenreService from 'src/services/Genre.Service';
import { GenreResolvers, MutationResolvers, QueryResolvers, GenreData } from 'src/types';
import GenreBookRelService from 'src/services/GenreBookRel.Service';

// Genre type field resolvers
export const genreTypeResolver: GenreResolvers = {
  id: (parent) => parent._id.toString(),
  name: (parent) => parent.name,
  description: (parent) => parent.description,
  books: async (parent) => {
    if (!parent.books) {
      return [];
    }
    const books = await Promise.all(
      parent.books?.map(async (book) => (book === null ? null : await BookService.getOneById(book._id))),
    );
    return books;
  },
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};

// Queries
export const genresByNameResolver: QueryResolvers['genresByName'] = async (_, args) => {
  const genre = await GenreService.getGenresWithName(args.name as string);
  if (!genre || genre.length === 0) {
    throw new GraphQLError(`Genre with name include "${args.name}" does not exist`, {
      extensions: { code: getReasonPhrase(StatusCodes.NOT_FOUND) },
    });
  }
  return genre;
};

export const genreByIdResolver: QueryResolvers['genreById'] = async (_, args) => {
  const genre = await GenreService.getOneById(args.id as string);
  if (genre === null) {
    throw new GraphQLError(`Genre with id "${args.id}" does not exist`, {
      extensions: { code: getReasonPhrase(StatusCodes.NOT_FOUND) },
    });
  }
  return genre;
};

// Mutations
export const createGenreResolver: MutationResolvers['createGenre'] = async (_, args) => {
  let newGenre: GenreData | null;
  try {
    newGenre = await GenreService.addOne(args as GenreData);
    if (newGenre === null) throw new Error('Can not create genre');
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }
  return newGenre;
};

export const addBookToGenreResolver: MutationResolvers['addBookToGenre'] = async (_, args) => {
  try {
    await GenreBookRelService.addOne(args.bookId, args.genreId);
  } catch (err) {
    throw new GraphQLError((err as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }

  const genre = await GenreService.getOneById(args.genreId);

  if (genre === null)
    throw new GraphQLError(`Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.BAD_REQUEST),
      },
    });
  return genre;
};

export const removeBookFromGenreResolver: MutationResolvers['removeBookFromGenre'] = async (_, args) => {
  try {
    await GenreBookRelService.deleteGenreBookRel(args.bookId, args.genreId);
  } catch (err) {
    throw new GraphQLError((err as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }

  const genre = await GenreService.getOneById(args.genreId);

  if (genre === null)
    throw new GraphQLError(`Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.BAD_REQUEST),
      },
    });
  return genre;
};
