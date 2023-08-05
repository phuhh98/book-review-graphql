import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import BookService from '../../services/Book.Service';
import GenreBookRelService from '../../services/GenreBookRel.Service';
import { BookData } from '../../types/models';
import { createNextErrorMessage } from '../../utils';

interface IBookController {
  addBook: RequestHandler<{}, BookData | {}>;
  getBookByIdOrTitle: RequestHandler<
    {},
    BookData | {},
    { id?: string; title: string }
  >;
  updateBook: RequestHandler<{ id: string }, BookData | {}>;
  deleteBook: RequestHandler<{ id: string }>;
  addGenreToBook: RequestHandler<{ id: string }, {}, { genreId: string }>;
  removeGenreFromBook: RequestHandler<{ id: string }, {}, { genreId: string }>;
}

export const BookController: IBookController = {
  addBook: async (req, res, next) => {
    let newBook: BookData | null = null;
    try {
      newBook = await BookService.addOne(req.body);
      return res.status(StatusCodes.CREATED).json(newBook ?? {});
    } catch (err) {
      if (err instanceof Error) {
        return next(
          createNextErrorMessage(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
          ),
        );
      }
    }
  },
  getBookByIdOrTitle: async (req, res, next) => {
    const { id, title } = req.query;
    let book: BookData | null = null;

    if (id && title) {
      return next(
        createNextErrorMessage(
          StatusCodes.BAD_REQUEST,
          'Too many query params. Only title or id',
        ),
      );
    }

    try {
      if (id) {
        book = await BookService.getOneById(id as string);
      } else if (title) {
        book = await BookService.getOneByTitle(title as string);
      }
    } catch (error) {
      if (error instanceof Error)
        return next(
          createNextErrorMessage(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
          ),
        );
    }

    if (book === null) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    } else {
      return res.status(StatusCodes.OK).json(book ?? {});
    }
  },

  updateBook: async (req, res, next) => {
    const { id } = req.params;

    try {
      await BookService.updateOneById(id, req.body);
    } catch (err) {
      if (err instanceof Error) {
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, err.message),
        );
      }
    }

    return res.status(StatusCodes.OK).send('Updated success').end();
  },

  deleteBook: async (req, res, next) => {
    const { id } = req.params;

    try {
      await BookService.deleteOneById(id);
    } catch (err) {
      if (err instanceof Error) {
        return next(
          createNextErrorMessage(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
          ),
        );
      }
    }
    return res.status(StatusCodes.OK).send('Delete success').end();
  },

  addGenreToBook: async (req, res, next) => {
    const { id: bookId } = req.params;
    const { genreId } = req.body;

    try {
      await GenreBookRelService.addOne(bookId, genreId);
    } catch (error) {
      if (error instanceof Error)
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message),
        );
    }

    return res.status(StatusCodes.OK).send('Update success').end();
  },

  removeGenreFromBook: async (req, res, next) => {
    const { id: bookId } = req.params;
    const { genreId } = req.body;

    try {
      await GenreBookRelService.deleteGenreBookRel(bookId, genreId);
    } catch (error) {
      if (error instanceof Error)
        return next(
          createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message),
        );
    }

    return res.status(StatusCodes.OK).send('Update success').end();
  },
};
