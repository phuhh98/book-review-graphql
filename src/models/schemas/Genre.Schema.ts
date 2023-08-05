import { Schema } from 'mongoose';
import {
  GENERAL_FIELDS,
  GENRE_BOOK_REL_FIELDS,
  MODEL_ALIAS,
} from '../../constants/index';
import { GenreBookRelModel } from '..';
import { GenreData } from '../../types/models';

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
      unique: true,
    },
    description: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

GenreSchema.virtual('books', {
  ref: MODEL_ALIAS.GenreBookRel,
  localField: GENERAL_FIELDS._id,
  foreignField: GENRE_BOOK_REL_FIELDS.genreId,
});

// clear relation on delete
GenreSchema.pre<GenreData>('deleteOne', async function (next) {
  const session = await GenreBookRelModel.startSession();
  GenreBookRelModel.deleteMany({
    [GENRE_BOOK_REL_FIELDS.genreId]: this._id,
  }).session(session);

  next();
});

export { GenreSchema };
