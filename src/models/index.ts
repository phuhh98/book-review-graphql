import mongoose from 'mongoose';
import { MODEL_ALIAS } from '../constants';
import { BookSchema } from './schemas/Book.Schema';
import { GenreSchema } from './schemas/Genre.Schema';
import { GenreBookRelSchema } from './schemas/GenreBookRel.Schema';
import { ProfileSchema } from './schemas/Profile.Schema';
import { AuthorSchema } from './schemas/Author.Schema';
import { UserSchema } from './schemas/User.Schema';
import { AuthorBookRelSchema } from './schemas/AuthorBookRel.Schema';

export const BookModel = mongoose.model(MODEL_ALIAS.Book, BookSchema);
export const GenreModel = mongoose.model(MODEL_ALIAS.Genre, GenreSchema);
export const GenreBookRelModel = mongoose.model(
  MODEL_ALIAS.GenreBookRel,
  GenreBookRelSchema,
);
export const ProfileModel = mongoose.model(MODEL_ALIAS.Profile, ProfileSchema);
export const AuthorModel = mongoose.model(MODEL_ALIAS.Author, AuthorSchema);
export const UserModel = mongoose.model(MODEL_ALIAS.User, UserSchema);
export const AuthorBookRelModel = mongoose.model(
  MODEL_ALIAS.AuthorBookRel,
  AuthorBookRelSchema,
);

// GridFs for Image to manage image media
export let ImageGridFsBucket: mongoose.mongo.GridFSBucket;
mongoose.connection.on('connected', () => {
  ImageGridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: MODEL_ALIAS.Image,
  });
});
