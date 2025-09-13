import mongoose, { Schema, Document } from "mongoose";

import { Address } from "../../../../domain/entities/User"; 

const AddressSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["billing", "shipping"], required: true },
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);


export interface UserDocument extends Document {
  id: string;
  email: string;
  phoneNumber?: string | null;
  passwordHash?: string | null;
  status?: "active" | "inactive" | "banned" | "pendingVerification";

  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  profileImageUrl?: string | null;

  addresses?:  Address[];

  emailVerified?: boolean | null;
  phoneVerified?: boolean | null;
  twoFactorEnabled?: boolean | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  failedLoginAttempts: number;
  passwordResetToken?: string | null;
  passwordResetExpiresAt?: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}


const UserSchema = new Schema<UserDocument>(
  {
    id: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: null },
    passwordHash: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "banned", "pendingVerification"],
      default: "pendingVerification",
    },

    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    username: { type: String, default: null },
    gender: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    profileImageUrl: { type: String, default: null },

    addresses: { type: [AddressSchema], default: [] },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: String, default: null },
    lastLoginIp: { type: String, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    passwordResetToken: { type: String, default: null },
    passwordResetExpiresAt: { type: String, default: null },

    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    deletedAt: { type: String, default: null },
  },
  {
    collection: "users",
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
