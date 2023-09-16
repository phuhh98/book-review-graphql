import { Schema, Types } from 'mongoose';
import { UserData } from '../../types';
import { MODEL_ALIAS } from '../../constants';
import { ProfileModel } from '..';

const UserSchema = new Schema<UserData>(
  {
    email: {
      type: String,
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
UserSchema.pre<UserData>('deleteOne', async function (next) {
  // Clrear Profile when delete
  await ProfileModel.deleteOne({ _id: new Types.ObjectId(this.profile) });
  next();
});

export { UserSchema };
