import { ObjectId } from 'mongoose';

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookData extends Timestamp {
  _id: ObjectId;
  title: string;
  description?: string;
  rating?: number;
  publish_date?: Date;
  publisher?: string;
  genres?: GenreData[] /* virutal field in mongoose */;
}

export interface GenreData extends Timestamp {
  _id: ObjectId;
  name: string;
  alias: string;
  description: string;
  books?: BookData[] /* virutal field in mongoose */;
}

export interface GenreBookRelData extends Timestamp {
  bookId: ObjectId;
  genreId: ObjectId;
}
