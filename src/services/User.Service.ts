import { IUserService, UserData, ProfileData, UserDataAfterPopulated } from '../types';
import { Model, isValidObjectId } from 'mongoose';
import { createMongoObjectIdFromString } from '../utils';

export default class UserService implements IUserService {
  constructor(
    private userModel: Model<UserData>,
    private profileModel: Model<ProfileData>,
  ) {}

  async addOne(userData: UserDataAfterPopulated): Promise<UserData | null> {
    const userProfile = new this.profileModel(userData.profile);
    await userProfile.save({ session: await this.getProfileTransactionSession() });

    const newUser = new this.userModel({
      email: userData.email,
    });

    await newUser.save({ session: await this.getUserModelTransactionSession() });

    return newUser;
  }

  async getOneById(userId: UserData['_id'] | string): Promise<UserData | null> {
    this.checkUserIdValidOrThrowError(userId);
    const userRecord = await this.userModel.findById(userId);

    return userRecord;
  }

  async updateProfileById(
    userId: UserData['_id'] | string,
    profileData: UserDataAfterPopulated['profile'],
  ): Promise<void> {
    this.checkUserIdValidOrThrowError(userId);

    const userRecord = await this.userModel.findById(userId);
    if (!userRecord) {
      throw new Error('User not found');
    }

    // If no profile attach => create a profile and attach to the user
    if (!userRecord.profile) {
      const userProfile = new this.profileModel(profileData);
      await userProfile.save({ session: await this.getProfileTransactionSession() });

      userRecord.profile = userProfile._id;
      await userRecord.save({ session: await this.getUserModelTransactionSession() });
      return;
    }

    // if profile exist, update it .
    await this.profileModel
      .updateOne(
        { _id: createMongoObjectIdFromString(userRecord.profile.toString()) },
        { ...profileData },
        { runValidators: true },
      )
      .session(await this.getProfileTransactionSession());
  }

  private async getUserModelTransactionSession() {
    return await this.userModel.startSession();
  }

  private async getProfileTransactionSession() {
    return await this.profileModel.startSession();
  }

  private checkUserIdValidOrThrowError(userId: UserData['_id'] | string) {
    const userIdNotValid = !isValidObjectId(userId);
    if (userIdNotValid) {
      throw new Error(`GenreService: genreId is not valid.`);
    }
  }
}
