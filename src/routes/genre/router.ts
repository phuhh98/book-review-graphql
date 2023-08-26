import { Router } from 'express';
import { GenreController } from './controller';
import { GenreService } from 'src/services';

const genreRouter = Router();
const genreController = new GenreController(GenreService);

genreRouter.get('/', genreController.getGenreByIdOrName);
genreRouter.post('/', genreController.addGenre);
genreRouter.patch('/:id', genreController.updateGenre);

export { genreRouter };
