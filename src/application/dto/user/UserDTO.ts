import { Address } from "@/domain/entities/User";


export interface RegisterUserDTO {
  email: string;
  phoneNumber?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface LoginUserDTO {
  email?: string;   
  phoneNumber?: string; 
  password: string;
  ip?: string; 
}

export interface AuthResponseDTO {
  id: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  email: string;
  token: string; 
}


export interface RequestPasswordResetDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
}


export interface AddAddressDTO {
  userId: string;
  address: Address;
}

export interface UpdateAddressDTO {
  userId: string;
  addressId: string;
  updates: Partial<Address>;
}
