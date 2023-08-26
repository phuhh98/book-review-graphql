import { Schema } from 'mongoose';
import { GenreData } from '../../types';
import { createMongoObjectIdFromString } from '../../utils';
import { GenreBookRelModel } from '..';

const GenreSchema = new Schema<GenreData>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    alias: {
      type: String,
      lowercase: true,
      sparse: true,
    },
    description: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// clear relation on delete
GenreSchema.pre<GenreData>('deleteOne', async function (next) {
  // clear genre in books when genre is deleted
  await GenreBookRelModel.deleteMany({
    genreId: createMongoObjectIdFromString(this._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  next();
});

export { GenreSchema };
