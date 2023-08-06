import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createMongoObjectIdFromString, createNextErrorMessage } from '../../utils';
import { ImageGridFsBucket } from 'src/models';
import mongoose, { isValidObjectId, mongo } from 'mongoose';

interface IImageController {
  getImage: RequestHandler<{ id: String }, {}>;
}

export const ImageController: IImageController = {
  getImage: async (req, res, next) => {
    const { id: imageId } = req.params;
    if (!isValidObjectId(imageId.toString())) {
      return next(createNextErrorMessage(StatusCodes.BAD_REQUEST, 'Invalid image id'));
    }

    const imageMetaData = await mongoose.connection.db
      .collection('Image.files')
      .findOne({ _id: createMongoObjectIdFromString(imageId.toString()) });

    if (!imageMetaData) {
      return next(createNextErrorMessage(StatusCodes.NOT_FOUND, 'Asset not found'));
    }

    const imageReadStream = ImageGridFsBucket.openDownloadStream(
      createMongoObjectIdFromString(imageId.toString()),
    );

    imageReadStream.pipe(res);
    res.status(StatusCodes.OK);
  },
};
