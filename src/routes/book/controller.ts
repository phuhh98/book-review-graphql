import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import BookService from 'src/services/Book.Service';
import { Book } from 'src/types';

interface IBookController {
  addBook: RequestHandler<{}, Book | {}>;
  getBookById: RequestHandler<{ id: string }, Book | {}>;
  getBookByTitle: RequestHandler<{}, Book | {}, {}, { title: string }>;
}

export const BookController: IBookController = {
  addBook: async (req, res) => {
    const newBookData = await BookService.addOne(req.body);
    res.status(StatusCodes.CREATED).json(newBookData ?? {});
  },
  getBookByTitle: async (req, res) => {
    const { title } = req.query;
    const book = await BookService.getOneByTitle(title);
    res.status(StatusCodes.OK).json(book ?? {});
  },
  getBookById: async (req, res) => {
    const { id } = req.params;
    const book = await BookService.getOneById(id);
    console.log(book);
    res.status(StatusCodes.OK).json(book ?? {});
  },
};
