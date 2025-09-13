import { User, Address } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { UserModel, UserDocument } from "./models/UserModel";

export class MongoUserRepository implements UserRepository {
  


  private toEntity(doc: UserDocument): User {
    return {
      id: doc.id,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      passwordHash: doc.passwordHash,
      status: doc.status,

      firstName: doc.firstName,
      lastName: doc.lastName,
      username: doc.username,
      gender: doc.gender,
      dateOfBirth: doc.dateOfBirth,
      profileImageUrl: doc.profileImageUrl,

      addresses: doc.addresses,

      emailVerified: doc.emailVerified,
      phoneVerified: doc.phoneVerified,
      twoFactorEnabled: doc.twoFactorEnabled,
      lastLoginAt: doc.lastLoginAt,
      lastLoginIp: doc.lastLoginIp,
      failedLoginAttempts: doc.failedLoginAttempts,
      passwordResetToken: doc.passwordResetToken,
      passwordResetExpiresAt: doc.passwordResetExpiresAt,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
    };
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create(user);
    return this.toEntity(created);
  }


  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const doc = await UserModel.findOne({ phoneNumber }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const doc = await UserModel.findOne({ passwordResetToken: token }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const doc = await UserModel.findOneAndUpdate({ id }, updates, {
      new: true,
    }).exec();
    if (!doc) throw new Error("User not found");
    return this.toEntity(doc);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await UserModel.updateOne({ id }, { passwordHash }).exec();
  }

  async updateLastLogin(id: string, ip: string): Promise<void> {
    await UserModel.updateOne(
      { id },
      { lastLoginAt: new Date().toISOString(), lastLoginIp: ip }
    ).exec();
  }

  async updateStatus(
    id: string,
    status: "active" | "inactive" | "banned" | "pendingVerification"
  ): Promise<void> {
    await UserModel.updateOne({ id }, { status }).exec();
  }

  async delete(id: string): Promise<void> {
    await UserModel.deleteOne({ id }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await UserModel.updateOne(
      { id },
      { deletedAt: new Date().toISOString() }
    ).exec();
  }

  async restore(id: string): Promise<void> {
    await UserModel.updateOne({ id }, { deletedAt: null }).exec();
  }

  async verifyEmail(id: string): Promise<void> {
    await UserModel.updateOne({ id }, { emailVerified: true }).exec();
  }

  async verifyPhone(id: string): Promise<void> {
    await UserModel.updateOne({ id }, { phoneVerified: true }).exec();
  }

  async setPasswordResetToken(
    id: string,
    token: string,
    expiresAt: string
  ): Promise<void> {
    await UserModel.updateOne(
      { id },
      { passwordResetToken: token, passwordResetExpiresAt: expiresAt }
    ).exec();
  }

  async clearPasswordResetToken(id: string): Promise<void> {
    await UserModel.updateOne(
      { id },
      { passwordResetToken: null, passwordResetExpiresAt: null }
    ).exec();
  }

  async addAddress(userId: string, address: Address): Promise<User> {
    const doc = await UserModel.findOneAndUpdate(
      { id: userId },
      { $push: { addresses: address } },
      { new: true }
    ).exec();
    if (!doc) throw new Error("User not found");
    return this.toEntity(doc);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updates: Partial<Address>
  ): Promise<User> {
    const doc = await UserModel.findOneAndUpdate(
      { id: userId, "addresses.id": addressId },
      { $set: { "addresses.$": { ...updates, id: addressId } } },
      { new: true }
    ).exec();
    if (!doc) throw new Error("User or address not found");
    return this.toEntity(doc);
  }

  async removeAddress(userId: string, addressId: string): Promise<User> {
    const doc = await UserModel.findOneAndUpdate(
      { id: userId },
      { $pull: { addresses: { id: addressId } } },
      { new: true }
    ).exec();
    if (!doc) throw new Error("User not found");
    return this.toEntity(doc);
  }

  async setDefaultAddress(
    userId: string,
    addressId: string,
    type: "billing" | "shipping"
  ): Promise<User> {
    //  unset all
    await UserModel.updateOne(
      { id: userId, "addresses.type": type },
      { $set: { "addresses.$[].isDefault": false } }
    ).exec();

    // Set the new default
    const doc = await UserModel.findOneAndUpdate(
      { id: userId, "addresses.id": addressId },
      { $set: { "addresses.$.isDefault": true } },
      { new: true }
    ).exec();

    if (!doc) throw new Error("User or address not found");
    return this.toEntity(doc);
  }
}
