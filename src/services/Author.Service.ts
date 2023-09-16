import { AuthorData, ProfileData, AuthorDataAfterPopulated, UserData } from '../types';
import { Model, isValidObjectId } from 'mongoose';
import { createMongoObjectIdFromString } from '../utils';

export default class AuthorService {
  constructor(
    private authorModel: Model<AuthorData>,
    private profileModel: Model<ProfileData>,
    private userModel: Model<UserData>,
  ) {}

  async addOne(authorData: AuthorDataAfterPopulated): Promise<AuthorData | null> {
    const authorProfile = new this.profileModel(authorData.profile);
    await authorProfile.save({ session: await this.getProfileTransactionSession() });

    const newUser = new this.authorModel({
      bio: authorData.bio,
    });

    await newUser.save({ session: await this.getUserModelTransactionSession() });

    return newUser;
  }

  async getOneById(authorId: AuthorData['_id'] | string): Promise<AuthorData | null> {
    this.checkObjectIdValidOrThrowError(authorId);
    const authorRecord = await this.authorModel.findById(authorId);

    return authorRecord;
  }

  async updateOneById(
    authorId: AuthorData['_id'] | string,
    updateData: AuthorDataAfterPopulated,
  ): Promise<void> {
    this.checkObjectIdValidOrThrowError(authorId);

    const authorRecord = await this.authorModel.findById(authorId);
    if (!authorRecord) {
      throw new Error('User not found');
    }

    // If no profile attach => create a profile and attach to the user
    if (!authorRecord.profile) {
      const userProfile = new this.profileModel(updateData.profile);
      await userProfile.save({ session: await this.getProfileTransactionSession() });

      authorRecord.profile = userProfile._id;
      await authorRecord.save({ session: await this.getUserModelTransactionSession() });
      return;
    }

    // if profile exist, update it .
    await this.profileModel
      .updateOne(
        { _id: createMongoObjectIdFromString(authorRecord.profile.toString()) },
        { ...updateData.profile },
        { runValidators: true },
      )
      .session(await this.getProfileTransactionSession());

    await this.authorModel.updateOne(
      { _id: createMongoObjectIdFromString(authorId.toString()) },
      {
        ...(updateData.bio ? { bio: updateData.bio } : {}),
      },
    );
  }

  async updateLinkToUser(authorId: AuthorData['_id'], userId: UserData['_id']) {
    this.checkObjectIdValidOrThrowError(authorId);
    this.checkObjectIdValidOrThrowError(userId);

    const userRecord = await this.userModel.findById(userId);
    if (!userRecord) {
      throw new Error('User does not exist');
    }

    const authorRecord = await this.authorModel.findById(authorId);
    if (!authorRecord) {
      throw new Error('Author does not exist');
    }

    authorRecord.linked_user = userRecord._id;

    await authorRecord.save({ session: await this.getUserModelTransactionSession() });
  }

  private async getUserModelTransactionSession() {
    return await this.authorModel.startSession();
  }

  private async getProfileTransactionSession() {
    return await this.profileModel.startSession();
  }

  private checkObjectIdValidOrThrowError(objectId: AuthorData['_id'] | string) {
    const authorIdNotValid = !isValidObjectId(objectId);
    if (authorIdNotValid) {
      throw new Error(`ObjectId is invalid`);
    }
  }
}
