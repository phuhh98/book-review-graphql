import { Schema, Types } from 'mongoose';
import { AuthorData } from '../../types';
import { MODEL_ALIAS } from '../../constants';
import { AuthorBookRelModel, ProfileModel } from '..';

const AuthorSchema = new Schema<AuthorData>(
  {
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
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// clear relations on delete
AuthorSchema.pre<AuthorData>('deleteOne', async function (next) {
  await AuthorBookRelModel.deleteMany({
    bookId: new Types.ObjectId(this._id),
  }).session(await AuthorBookRelModel.startSession());

  // Clrear Profile when delete
  await ProfileModel.deleteOne({ _id: new Types.ObjectId(this.profile) }).session(
    await ProfileModel.startSession(),
  );
  next();
});

export { AuthorSchema };
