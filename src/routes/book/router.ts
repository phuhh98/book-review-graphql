import { Router } from 'express';
import { BookController } from './controller';
import { BookService, GenreBookRelService } from 'src/services';

const bookRouter = Router();
const bookController = new BookController(BookService, GenreBookRelService);

bookRouter.get('/', bookController.getBookByIdOrTitle);
bookRouter.post('/', bookController.addBook);
bookRouter.patch('/:id', bookController.updateBook);
bookRouter.delete('/:id', bookController.deleteBook);

bookRouter.post('/add-genre/:id', bookController.addGenreToBook);
bookRouter.delete('/remove-genre/:id', bookController.removeGenreFromBook);

export { bookRouter };
