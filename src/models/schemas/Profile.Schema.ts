import { Schema, Types } from 'mongoose';
import { ImageGridFsBucket } from '..';
import { ProfileData } from '../../types/models';
import { createMongoObjectIdFromString } from 'src/utils';
import moment, { isDate } from 'moment';

const ProfileSchema = new Schema<ProfileData>(
  {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      unique: true,
    },
    date_of_birth: {
      type: Date,
      validate: {
        validator: (value: string) => (value ? isDate(value) : true),
      },
      transform: (_: unknown, value: Date) => moment(value).toISOString(),
    },
    profile_picture: Types.ObjectId,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// clear relations on delete
ProfileSchema.pre<ProfileData>('deleteOne', async function (next) {
  const profileCurrent = this;

  // Placeholder for delete author / user IF profile is deleted

  // clear Image in GridFs when delete
  if (profileCurrent.profile_picture) {
    ImageGridFsBucket.delete(
      createMongoObjectIdFromString(profileCurrent.profile_picture.toString()),
    );
  }

  next();
});

export { ProfileSchema };
