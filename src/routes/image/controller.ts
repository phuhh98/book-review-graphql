import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createMongoObjectIdFromString, createNextErrorMessage } from '../../utils';
import { ImageGridFsBucket } from 'src/models';
import mongoose, { isValidObjectId } from 'mongoose';

interface IImageController {
  getImage: RequestHandler<{ id: String }, {}>;
}

export const ImageController: IImageController = {
  getImage: async (req, res, next) => {
    const { id: imageId } = req.params;
    if (!isValidObjectId(imageId.toString())) {
      return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, 'Invalid image id'));
    }

    const imageMetaData = await ImageGridFsBucket.find({ _id: imageId });

    if ((await imageMetaData.toArray()).length === 0) {
      return next(createNextErrorMessage(StatusCodes.NOT_FOUND, 'Asset not found'));
    }

    const imageReadStream = ImageGridFsBucket.openDownloadStream(
      createMongoObjectIdFromString(imageId.toString()),
    );

    imageReadStream.pipe(res);
    res.status(StatusCodes.OK);
  },
};
