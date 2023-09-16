import { Schema, Types } from 'mongoose';
import { ProfileData } from '../../types';
import { createMongoObjectIdFromString } from '../../utils';
import moment, { isDate } from 'moment';
import { ImageGridFsBucket } from '..';

const ProfileSchema = new Schema<ProfileData>(
  {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
    },
    date_of_birth: {
      type: Date,
      validate: {
        validator: (value: string) => (value ? isDate(value) : true),
      },
      transform: (_: unknown, value: Date) => moment(value).format('DD/MM/YYYY'),
    },
    profile_picture: Types.ObjectId,
    bio: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// clear relations on delete
ProfileSchema.pre<ProfileData>('deleteOne', async function (next) {
  // Placeholder for delete author / user IF profile is deleted

  // clear Image in GridFs when delete
  if (this.profile_picture) {
    await ImageGridFsBucket.delete(
      createMongoObjectIdFromString(this.profile_picture.toString()),
    );
  }

  next();
});

export { ProfileSchema };
