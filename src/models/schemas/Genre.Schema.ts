import { Schema } from 'mongoose';
import { GenreData } from 'src/types';
import { createMongoObjectIdFromString } from 'src/utils';
import { GenreBookRelModel } from '..';
import { GenreData } from '../../types/models';
import { createMongoObjectIdFromString } from 'src/utils';

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
  const genreCurrent = this;

  // clear genre in books when genre is deleted
  GenreBookRelModel.deleteMany({
    genreId: createMongoObjectIdFromString(genreCurrent._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  next();
});

export { GenreSchema };
