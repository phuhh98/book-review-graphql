import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createNextErrorMessage } from '../../utils';
import { IBookService, IGenreBookRelService, BookData } from '../../types';
import { ParsedQs } from 'qs';

abstract class IBookController {
  abstract addBook: RequestHandler<{}, BookData | {}>;
  abstract getBookByIdOrTitle: RequestHandler<
    {},
    BookData | {},
    { id?: string; title: string }
  >;
  abstract updateBook: RequestHandler<{ id: string }, BookData | {}>;
  abstract deleteBook: RequestHandler<{ id: string }>;
  abstract addGenreToBook: RequestHandler<{ id: string }, {}, { genreId: string }>;
  abstract removeGenreFromBook: RequestHandler<{ id: string }, {}, { genreId: string }>;
}

export class BookController implements IBookController {
  constructor(
    private bookService: IBookService,
    private GBLService: IGenreBookRelService,
  ) {}
  addBook: RequestHandler<{}, {} | BookData, any, ParsedQs, Record<string, any>> = async (
    req,
    res,
    next,
  ) => {
    let newBook: BookData | null = null;
    try {
      newBook = await this.bookService.addOne(req.body);
      return res.status(StatusCodes.CREATED).json(newBook ?? {});
    } catch (err) {
      if (err instanceof Error) {
        return next(
          createNextErrorMessage(StatusCodes.INTERNAL_SERVER_ERROR, err.message),
        );
      }
    }
  };
  getBookByIdOrTitle: RequestHandler<
    {},
    {} | BookData,
    { id?: string | undefined; title: string },
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
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
        book = await this.bookService.getOneById(id as string);
      } else if (title) {
        book = await this.bookService.getOneByTitle(title as string);
      }
    } catch (error) {
      if (error instanceof Error)
        return next(
          createNextErrorMessage(StatusCodes.INTERNAL_SERVER_ERROR, error.message),
        );
    }

    if (book === null) {
      return res.status(StatusCodes.NOT_FOUND).json({});
    } else {
      return res.status(StatusCodes.OK).json(book ?? {});
    }
  };
  updateBook: RequestHandler<
    { id: string },
    {} | BookData,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
    const { id } = req.params;

    try {
      await this.bookService.updateOneById(id, req.body);
    } catch (err) {
      if (err instanceof Error) {
        return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, err.message));
      }
    }

    return res.status(StatusCodes.OK).send('Updated success').end();
  };

  deleteBook: RequestHandler<{ id: string }, any, any, ParsedQs, Record<string, any>> =
    async (req, res, next) => {
      const { id } = req.params;

      try {
        await this.bookService.deleteOneById(id);
      } catch (err) {
        if (err instanceof Error) {
          return next(
            createNextErrorMessage(StatusCodes.INTERNAL_SERVER_ERROR, err.message),
          );
        }
      }
      return res.status(StatusCodes.OK).send('Delete success').end();
    };
  addGenreToBook: RequestHandler<
    { id: string },
    {},
    { genreId: string },
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
    const { id: bookId } = req.params;
    const { genreId } = req.body;

    try {
      await this.GBLService.addOne(bookId, genreId);
    } catch (error) {
      if (error instanceof Error)
        return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message));
    }

    return res.status(StatusCodes.OK).send('Update success').end();
  };

  removeGenreFromBook: RequestHandler<
    { id: string },
    {},
    { genreId: string },
    ParsedQs,
    Record<string, any>
  > = async (req, res, next) => {
    const { id: bookId } = req.params;
    const { genreId } = req.body;

    try {
      await this.GBLService.deleteGenreBookRel(bookId, genreId);
    } catch (error) {
      if (error instanceof Error)
        return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, error.message));
    }

    return res.status(StatusCodes.OK).send('Update success').end();
  };
}
