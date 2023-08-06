import { Types } from 'mongoose';

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoObject {
  _id: Types.ObjectId;
}

export interface BookData extends Timestamp, MongoObject {
  title: string;
  description?: string;
  rating?: number;
  cover_image: Types.ObjectId;
  publish_date?: Date;
  publisher?: string;
  genres?: GenreData[] /* virutal field in mongoose */;
}

export interface GenreData extends Timestamp, MongoObject {
  name: string;
  alias: string;
  description: string;
  books?: BookData[] /* virutal field in mongoose */;
}

export interface GenreBookRelData extends Timestamp, MongoObject {
  bookId: Types.ObjectId;
  genreId: Types.ObjectId;
}

// export interface ImageData extends Timestamp, MongoObject {
//   uri: String;
//   docType: String;
//   file: Buffer;
// }
