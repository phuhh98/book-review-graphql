import { Router } from 'express';
import { BookController } from './controller';

const bookRouter = Router();

bookRouter.get('/', BookController.getBookByIdOrTitle);
bookRouter.post('/', BookController.addBook);
bookRouter.patch('/:id', BookController.updateBook);
bookRouter.delete('/:id', BookController.deleteBook);

bookRouter.post('/add-genre/:id', BookController.addGenreToBook);
bookRouter.delete('/remove-genre/:id', BookController.removeGenreFromBook);

export { bookRouter };
