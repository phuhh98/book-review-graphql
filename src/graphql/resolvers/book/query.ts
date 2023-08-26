import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { BookService } from 'src/services';
import { QueryResolvers } from 'src/types';

export const bookQueryResolvers: Pick<
  QueryResolvers,
  'booksByTitle' | 'bookById' | 'booksPublishedLatest'
> = {
  booksByTitle: async (_, args) => {
    const books = await BookService.getBooksWithTitle(args.title as string);

    if (books.length === 0) {
      throw new GraphQLError(`Book includes title "${args.title}" not found`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.NOT_FOUND),
        },
      });
    }

    return books;
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

  booksPublishedLatest: async (_, args) => {
    const books = await BookService.getLastestBooks(
      args.maxItems?.toString(),
      args.offset?.toString(),
    );

    if (books.length === 0) {
      throw new GraphQLError(`No recent book`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.NOT_FOUND),
        },
      });
    }

    return books;
  },
};
