import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BookData, GenreData, IGenreService } from '../../types';
import { createNextErrorMessage } from '../../utils';
import { ParsedQs } from 'qs';

abstract class IGenreController {
  abstract addGenre: RequestHandler<{}, BookData | {}>;
  abstract getGenreByIdOrName: RequestHandler<
    {},
    BookData | {},
    { id?: string; name?: string }
  >;
  abstract updateGenre: RequestHandler<{ id: string }, GenreData | {}, GenreData>;
}

export class GenreController implements IGenreController {
  constructor(private genreService: IGenreService) {}
  addGenre: RequestHandler<{}, {} | BookData, any, ParsedQs, Record<string, any>> =
    async (req, res, next) => {
      let newGenre: GenreData | null = null;
      try {
        newGenre = await this.genreService.addOne(req.body);
        return res.status(StatusCodes.CREATED).json(newGenre ?? {});
      } catch (error) {
        if (error instanceof Error) {
          return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message));
        }
      }
    };

  getGenreByIdOrName: RequestHandler<
    {},
    {} | BookData,
    { id?: string | undefined; name?: string | undefined },
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
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
        genre = await this.genreService.getOneById(id as string);
      } else if (name) {
        genre = await this.genreService.getOneByName(name as string);
      }
    } catch (error) {
      if (error instanceof Error)
        return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message));
    }

    if (genre === null) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    } else {
      return res.status(StatusCodes.OK).json(genre ?? {});
    }
  };

  updateGenre: RequestHandler<
    { id: string },
    {} | GenreData,
    GenreData,
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
    const { id } = req.params;

    try {
      await this.genreService.updateOneById(id, req.body);
    } catch (err) {
      if (err instanceof Error) {
        return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, err.message));
      }
    }

    return res.status(StatusCodes.OK).send('Updated success').end();
  };
}
