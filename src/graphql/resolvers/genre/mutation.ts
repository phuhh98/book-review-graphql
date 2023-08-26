import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { GenreBookRelService, GenreService } from '../../../services';
import { GenreData, MutationResolvers } from '../../../types';

export const genreMutationResolvers: Pick<
  MutationResolvers,
  'createGenre' | 'addBookToGenre' | 'removeBookFromGenre'
> = {
  createGenre: async (_, args) => {
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
  },
  addBookToGenre: async (_, args) => {
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
      throw new GraphQLError(
        `Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    return genre;
  },

  removeBookFromGenre: async (_, args) => {
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
      throw new GraphQLError(
        `Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    return genre;
  },
};
