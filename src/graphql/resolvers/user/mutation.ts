import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { UserService } from '../../../services';
import { MutationResolvers, UserDataAfterPopulated } from '../../../types';
import { ImageGridFsBucket } from '../../../models';
import { createMongoObjectIdFromString } from '../../../utils';
import { FileUpload } from 'graphql-upload/Upload';
import { ALLOW_IMAGE_EXT } from '../../../constants';
import path from 'path';

export const userMutationResolvers: Pick<
  MutationResolvers,
  'createUserProfile' | 'uploadUserProfilePicture' | 'updateUserProfile'
> = {
  createUserProfile: async (_, args) => {
    let newUser: UserDataAfterPopulated | null;

    try {
      newUser = await UserService.addOne({
        email: args.email,
        profile: {
          first_name: args.first_name,
          last_name: args.last_name,
          date_of_birth: args.date_of_birth as string,
          ...(args.bio ? { bio: args.bio } : {}),
        },
      });
      if (newUser === null) throw new Error('Can not create user');
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    }
    return newUser as unknown as UserDataAfterPopulated;
  },

  updateUserProfile: async (_, args) => {
    let updatedUser: UserDataAfterPopulated | null;

    try {
      updatedUser = await UserService.updateProfileById(args.userId, {
        ...(args.first_name ? { first_name: args.first_name } : {}),
        ...(args.last_name ? { last_name: args.last_name } : {}),
        date_of_birth: args.date_of_birth as string,
        ...(args.bio ? { bio: args.bio } : {}),
      });
      if (updatedUser === null) throw new Error('Can not create user');
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    }
    return updatedUser as unknown as UserDataAfterPopulated;
  },

  uploadUserProfilePicture: async (_, { profile_picture, userId }) => {
    const user = (await UserService.getOneById(
      userId,
    )) as unknown as UserDataAfterPopulated | null;
    if (user == null) {
      throw new GraphQLError(
        `File upload failed. User with id "${userId}" does not exist`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    }

    try {
      if (user.profile.profile_picture) {
        await ImageGridFsBucket.delete(
          createMongoObjectIdFromString(user.profile.profile_picture.toString()),
        );
      }
    } catch (error) {
      console.error(error);
    }

    // pipe readStream from request of a file to image writeStream of GridFs to write directly to mongodb
    // eslint-disable-next-line
    const { createReadStream, filename } = await (async () =>
      profile_picture as Promise<FileUpload>)();

    if (!ALLOW_IMAGE_EXT.includes(path.extname(filename))) {
      console.error('fileType', path.extname(filename));
      throw new GraphQLError(
        `Only ${ALLOW_IMAGE_EXT.join(' and ')} file(s) are allowed`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    }

    const imageWriteStream = ImageGridFsBucket.openUploadStream(filename);
    createReadStream().pipe(imageWriteStream);

    const newProfilePictureId = imageWriteStream.id;
    try {
      await UserService.updateProfileById(user._id, {
        profile_picture: newProfilePictureId,
      });
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }

    imageWriteStream.on('error', (err) => {
      throw new GraphQLError(`Error while uploading profile picture. \n${err.message}`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    });

    const updatedUser = await UserService.getOneById(user._id);
    return {
      success: true,
      message: 'User profile picture uploaded',
      user: updatedUser,
    };
  },
};
