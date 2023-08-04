import mongoose, { Schema } from 'mongoose';
import moment from 'moment';
import {
  BOOK_FIELDS,
  GENERAL_FIELDS,
  GENRE_BOOK_REL_FIELDS,
  MODEL_ALIAS,
} from 'src/constants';
import { Book } from 'src/types';
import { isDate } from 'util/types';
import { GenreBookRelModel } from '..';

const BookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    description: String,
    rating: Number,
    publish_date: {
      type: Date,
      validate: {
        validator: (value: string) => (value ? isDate(value) : true),
      },
      transform: (_: unknown, value: Date) => moment(value).toISOString(),
    },
    publisher: String,
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

BookSchema.virtual('genres', {
  ref: MODEL_ALIAS.GenreBookRel,
  localField: BOOK_FIELDS.id,
  foreignField: GENRE_BOOK_REL_FIELDS.bookId,
});

// clear relations on delete
BookSchema.pre<Book & { _id: string }>('deleteOne', async function (next) {
  const session = await GenreBookRelModel.startSession();
  GenreBookRelModel.deleteMany({
    [GENRE_BOOK_REL_FIELDS.bookId]: this._id,
  }).session(session);
  next();
});

export { BookSchema };
