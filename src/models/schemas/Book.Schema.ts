import { Schema } from 'mongoose';
import moment from 'moment';
import { isDate } from 'util/types';
import { GenreBookRelModel, ImageGridFsBucket } from '..';
import { BookData } from '../../types/models';
import { createMongoObjectIdFromString } from 'src/utils';

const BookSchema = new Schema<BookData>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    description: String,
    rating: Number,
    cover_image: String,
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
    bookId: bookCurrent._id,
  }).session(await GenreBookRelModel.startSession());

  // clear Image in GridFs when delete
  ImageGridFsBucket.delete(
    createMongoObjectIdFromString(bookCurrent.cover_image.toString()),
  );
  next();
});

export { BookSchema };
