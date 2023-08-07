import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import BookService from 'src/services/Book.Service';
import GenreService from 'src/services/Genre.Service';
import { QueryResolvers } from 'src/types';

export const queryResolver: Required<QueryResolvers> = {
  booksByTitle: async (_, args) => {
    const book = await BookService.getBooksWithTitle(args.title as string);

    if (book.length === 0) {
      throw new GraphQLError(`Book includes title "${args.title}" not found`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.NOT_FOUND),
        },
      });
    }

    return book;
  },

  bookById: async (_, args) => {
    const book = await BookService.getOneById(args.id);

    if (book === null)
      throw new GraphQLError(`Book with id "${args.id}" does not exist`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.NOT_FOUND),
        },
      });

    return book;
  },

  genresByName: async (_, args) => {
    const genre = await GenreService.getGenresWithName(args.name as string);
    if (!genre || genre.length === 0) {
      throw new GraphQLError(`Genre with name include "${args.name}" does not exist`, {
        extensions: { code: getReasonPhrase(StatusCodes.NOT_FOUND) },
      });
    }
    return genre;
  },

  genreById: async (_, args) => {
    const genre = await GenreService.getOneById(args.id as string);
    if (genre === null) {
      throw new GraphQLError(`Genre with id "${args.id}" does not exist`, {
        extensions: { code: getReasonPhrase(StatusCodes.NOT_FOUND) },
      });
    }
    return genre;
  },
};
