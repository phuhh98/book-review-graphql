import { UserResolvers } from '../../../types';
import { computeImageURIFromId } from '../../../utils';

// User type field resolvers
export const userTypeResolver: UserResolvers = {
  id: (parent) => parent._id.toString(),
  email: (parent) => parent.email,
  first_name: (parent) => {
    return parent.profile.first_name;
  },
  last_name: (parent) => parent.profile.last_name,
  date_of_birth: (parent) => parent.profile.date_of_birth,
  profile_picture: (parent) =>
    parent.profile.profile_picture
      ? computeImageURIFromId(parent.profile.profile_picture)
      : null,
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};
