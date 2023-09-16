import { Schema, Types } from 'mongoose';
import moment from 'moment';
import { BookData } from '../../types';
import { createMongoObjectIdFromString } from '../../utils';
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
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// clear relations on delete
BookSchema.pre<BookData>('deleteOne', async function (next) {
  // clear book in genres when book is deleted
  await GenreBookRelModel.deleteMany({
    bookId: createMongoObjectIdFromString(this._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  await AuthorBookRelModel.deleteMany({
    bookId: createMongoObjectIdFromString(this._id.toString()),
  }).session(await GenreBookRelModel.startSession());

  // clear Image in GridFs when delete
  if (this.cover_image) {
    await ImageGridFsBucket.delete(
      createMongoObjectIdFromString(this.cover_image.toString()),
    );
  }

  next();
});

export { BookSchema };
