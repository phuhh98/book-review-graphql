import { Router } from 'express';
import { ImageController } from './controller';

const imageRouter = Router();

imageRouter.get('/:id', ImageController.getImage);

export { imageRouter };
