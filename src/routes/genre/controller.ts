import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import GenreService from '../../services/Genre.Service';
import { BookData, GenreData } from '../../types/models';
import { createNextErrorMessage } from '../../utils';

interface IGenreController {
  addGenre: RequestHandler<{}, BookData | {}>;
  getGenreByIdOrName: RequestHandler<
    {},
    BookData | {},
    { id?: string; name?: string }
  >;
  updateGenre: RequestHandler<{ id: string }, GenreData | {}, GenreData>;
}

export const GenreController: IGenreController = {
  addGenre: async (req, res, next) => {
    let newGenre: GenreData | null = null;
    try {
      newGenre = await GenreService.addOne(req.body);
      return res.status(StatusCodes.CREATED).json(newGenre ?? {});
    } catch (error) {
      if (error instanceof Error) {
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message),
        );
      }
    }
  },

  getGenreByIdOrName: async (req, res, next) => {
    const { id, name } = req.query;
    let genre: GenreData | null = null;

    if (id && name) {
      return next(
        createNextErrorMessage(
          StatusCodes.BAD_REQUEST,
          'Too many query params. Only name or id',
        ),
      );
    }
    try {
      if (id) {
        genre = await GenreService.getOneById(id as string);
      } else if (name) {
        genre = await GenreService.getOneByName(name as string);
      }
    } catch (error) {
      if (error instanceof Error)
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message),
        );
    }

    if (genre === null) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    } else {
      return res.status(StatusCodes.OK).json(genre ?? {});
    }
  },

  updateGenre: async (req, res, next) => {
    const { id } = req.params;

    try {
      await GenreService.updateOneById(id, req.body);
    } catch (err) {
      if (err instanceof Error) {
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, err.message),
        );
      }
    }

    return res.status(StatusCodes.OK).send('Updated success').end();
  },
};
