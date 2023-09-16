import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { UserService } from '../../../services';
import { QueryResolvers, UserDataAfterPopulated } from '../../../types';

export const userQueryResolvers: Pick<QueryResolvers, 'userProfileByEmail'> = {
  userProfileByEmail: async (_, args) => {
    const user = await UserService.getOneByEmail(args.email);
    if (!user) {
      throw new GraphQLError(`User with email "${args.email}" does not exist`, {
        extensions: { code: getReasonPhrase(StatusCodes.NOT_FOUND) },
      });
    }
    return user as unknown as UserDataAfterPopulated;
  },
};
