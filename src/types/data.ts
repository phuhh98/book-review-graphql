import { Types } from 'mongoose';

export type OdmID = Types.ObjectId;

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneralId {
  _id: OdmID;
}

export interface BookData extends Timestamp, GeneralId {
  title: string;
  description?: string;
  rating?: number;
  cover_image?: OdmID;
  publish_date?: Date;
  publisher?: string;
  genres?: GenreData[] /* virutal field in mongoose */;
}

export interface GenreData extends Timestamp, GeneralId {
  name: string;
  alias: string;
  description: string;
  books?: BookData[] /* virutal field in mongoose */;
}

export interface GenreBookRelData extends Timestamp, GeneralId {
  bookId: OdmID;
  genreId: OdmID;
}

export interface ProfileData extends Timestamp, GeneralId {
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  profile_picture?: OdmID;
}

export interface AuthorData extends Timestamp, GeneralId {
  bio?: string;
  linked_user?: OdmID;
  profile?: OdmID;
}

export interface AuthorDataAfterPopulated extends Timestamp, GeneralId {
  bio?: string;
  linked_user?: OdmID;
  profile: ProfileData;
}

export interface AuthorBookRelData extends Timestamp, GeneralId {
  bookId: OdmID;
  authorId: OdmID;
}

export interface UserData extends Timestamp, GeneralId {
  email: string;
  profile?: OdmID;
}

export interface UserDataAfterPopulated extends Timestamp, GeneralId {
  email: string;
  profile?: ProfileData;
}
