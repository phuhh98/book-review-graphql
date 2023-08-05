import { Schema } from 'mongoose';
import moment from 'moment';
import {
  BOOK_FIELDS,
  GENRE_BOOK_REL_FIELDS,
  MODEL_ALIAS,
} from '../../constants';
import { isDate } from 'util/types';
import { GenreBookRelModel } from '..';
import { BookData } from '../../types/models';

const BookSchema = new Schema<BookData>(
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
    toJSON: {
      virtuals: true,
    },
  },
);

BookSchema.virtual('genres', {
  ref: MODEL_ALIAS.GenreBookRel,
  localField: BOOK_FIELDS._id,
  foreignField: GENRE_BOOK_REL_FIELDS.bookId,
});

// clear relations on delete
BookSchema.pre<BookData>('deleteOne', async function (next) {
  const session = await GenreBookRelModel.startSession();
  GenreBookRelModel.deleteMany({
    [GENRE_BOOK_REL_FIELDS.bookId]: this._id,
  }).session(session);
  next();
});

export { BookSchema };
