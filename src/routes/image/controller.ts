import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createMongoObjectIdFromString, createNextErrorMessage } from '../../utils';
import { ImageGridFsBucket } from '../../models';
import { isValidObjectId } from 'mongoose';

interface IImageController {
  getImage: RequestHandler<{ id: String }, {}>;
}

export const ImageController: IImageController = {
  getImage: async (req, res, next) => {
    const { id: imageId } = req.params;
    if (!isValidObjectId(imageId.toString())) {
      return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, 'Invalid image id'));
    }

    const imageCursor = ImageGridFsBucket.find({
      _id: createMongoObjectIdFromString(imageId.toString()),
    });
    const imageMeta = await imageCursor.next();
    if (!imageMeta) {
      return next(createNextErrorMessage(StatusCodes.NOT_FOUND, 'Asset not found'));
    }

    const imageReadStream = ImageGridFsBucket.openDownloadStream(imageMeta._id);

    imageReadStream.pipe(res);
    res.status(StatusCodes.OK);
  },
};
