import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import BookService from 'src/services/Book.Service';
import { Book } from 'src/types';
import { BookController } from './controller';

const bookRouter = Router();

bookRouter.get('/:id', BookController.getBookById);
bookRouter.get('/', BookController.getBookByTitle);
bookRouter.post('/', BookController.addBook);

export { bookRouter };
