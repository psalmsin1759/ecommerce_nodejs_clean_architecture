export interface Address {
  id: string;
  type: "billing" | "shipping";
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}


export interface User {
  id: string;
  email: string;
  phoneNumber?: string | null | undefined;
  passwordHash?: string | null | undefined;
  status?:  "active" | "inactive" | "banned" | "pendingVerification" | undefined;

  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  username?: string | null | undefined;
  gender?: string | null | undefined;
  dateOfBirth?: string | null | undefined;
  profileImageUrl?: string | null | undefined;

  addresses?: Address[] | null | undefined;


  emailVerified?: boolean | null | undefined;
  phoneVerified?: boolean | null | undefined;
  twoFactorEnabled?: boolean | null | undefined;
  lastLoginAt?: string | null | undefined;
  lastLoginIp?: string | null | undefined;
  failedLoginAttempts: number;
  passwordResetToken?: string | null | undefined;
  passwordResetExpiresAt?: string | null | undefined;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
}
