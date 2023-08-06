import mongoose, { Types, isValidObjectId } from 'mongoose';
import { REST_PATH } from 'src/constants';

export const computeImageURIFromId = (imageId: Types.ObjectId): string => {
  if (!isValidObjectId(imageId.toString())) throw new Error('Invalid object id string');
  const host = process.env.SERVER_URL;

  return `${host}/${REST_PATH.IMAGE}/${imageId.toString()}`;
};

export const getImageIdFromUri = (imageUri: string): string => {
  const host = process.env.SERVER_URL;
  return imageUri.replace(`${host}/${REST_PATH.IMAGE}/`, '');
};

export const createMongoObjectIdFromString = (idString: string) => {
  try {
    if (!isValidObjectId(idString))
      throw new Error(`Invalid object id string: ${idString}`);
  } catch (err) {
    console.error(err);
  }

  return new mongoose.Types.ObjectId(idString);
};
