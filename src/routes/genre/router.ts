import { Router } from 'express';
import { GenreController } from './controller';
import { GenreService } from '../../services';

const genreRouter = Router();
const genreController = new GenreController(GenreService);

genreRouter.get('/', genreController.getGenreByIdOrName);
genreRouter.post('/', genreController.addGenre);
genreRouter.patch('/:id', genreController.updateGenre);

export { genreRouter };
