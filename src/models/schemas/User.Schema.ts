import { Schema, Types } from 'mongoose';
import { UserData } from '../../types';
import { MODEL_ALIAS } from '../../constants';
import { ProfileModel } from '..';

const UserSchema = new Schema<UserData>(
  {
    email: String,
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
UserSchema.pre<UserData>('deleteOne', async function (next) {
  const userCurrent = this;

  // Clrear Profile when delete
  ProfileModel.deleteOne({ _id: new Types.ObjectId(userCurrent.profile) });
  next();
});

export { UserSchema };
