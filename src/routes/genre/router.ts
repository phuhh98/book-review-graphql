import { Router } from 'express';
import { GenreController } from './controller';

const genreRouter = Router();

genreRouter.get('/', GenreController.getGenreByIdOrName);
genreRouter.post('/', GenreController.addGenre);
genreRouter.patch('/:id', GenreController.updateGenre);

export { genreRouter };
