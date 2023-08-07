import { Schema, Types } from 'mongoose';
import moment from 'moment';
import { isDate } from 'util/types';
import { AuthorBookRelModel, GenreBookRelModel, ImageGridFsBucket } from '..';
import { BookData } from '../../types/models';
import { createMongoObjectIdFromString } from 'src/utils';
import { isDate } from 'moment';
import { AuthorBookRelModel, GenreBookRelModel, ImageGridFsBucket } from '..';

const BookSchema = new Schema<BookData>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    description: String,
    rating: Number,
    cover_image: Types.ObjectId,
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

// clear relations on delete
BookSchema.pre<BookData>('deleteOne', async function (next) {
  const bookCurrent = this;

  // clear book in genres when book is deleted
  GenreBookRelModel.deleteMany({
    bookId: createMongoObjectIdFromString(bookCurrent._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  AuthorBookRelModel.deleteMany({
    bookId: createMongoObjectIdFromString(bookCurrent._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  // clear Image in GridFs when delete
  if (bookCurrent.cover_image) {
    ImageGridFsBucket.delete(
      createMongoObjectIdFromString(bookCurrent.cover_image.toString()),
    );
  }

  next();
});

export { BookSchema };
