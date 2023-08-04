import { Schema } from 'mongoose';
import {
  GENERAL_FIELDS,
  GENRE_BOOK_REL_FIELDS,
  MODEL_ALIAS,
} from 'src/constants';
import { Genre } from 'src/types';
import { GenreBookRelModel } from '..';

const GenreSchema = new Schema<Genre>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: {
      createdAt: GENERAL_FIELDS.created_at,
      updatedAt: GENERAL_FIELDS.updated_at,
    },
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  },
);

GenreSchema.virtual('books', {
  ref: MODEL_ALIAS.GenreBookRel,
  localField: GENERAL_FIELDS.id,
  foreignField: GENRE_BOOK_REL_FIELDS.genreId,
});

// clear relation on delete
GenreSchema.pre<Genre & { _id: string }>('deleteOne', async function (next) {
  const session = await GenreBookRelModel.startSession();
  GenreBookRelModel.deleteMany({
    [GENRE_BOOK_REL_FIELDS.genreId]: this._id,
  }).session(session);

  next();
});

export { GenreSchema };
