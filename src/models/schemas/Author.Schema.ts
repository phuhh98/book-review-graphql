import { Schema, Types } from 'mongoose';
import { AuthorBookRelModel, ProfileModel } from '..';
import { AuthorData } from '../../types/models';
import { MODEL_ALIAS } from 'src/constants';
import { createMongoObjectIdFromString } from 'src/utils';

const AuthorSchema = new Schema<AuthorData>(
  {
    bio: String,
    linked_user: {
      type: Types.ObjectId,
      ref: MODEL_ALIAS.User,
      unique: true,
    },
    profile: {
      type: Types.ObjectId,
      ref: MODEL_ALIAS.Profile,
      require: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// clear relations on delete
AuthorSchema.pre<AuthorData>('deleteOne', async function (next) {
  const authorCurrent = this;

  AuthorBookRelModel.deleteMany({
    bookId: new Types.ObjectId(authorCurrent._id),
  }).session(await AuthorBookRelModel.startSession());

  // Clrear Profile when delete
  ProfileModel.deleteOne({ _id: new Types.ObjectId(authorCurrent.profile) }).session(
    await ProfileModel.startSession(),
  );
  next();
});

export { AuthorSchema };