import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { GenreService } from '../../../services';
import { QueryResolvers } from '../../../types';

export const genreQueryResolvers: Pick<QueryResolvers, 'genresByName' | 'genreById'> = {
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
