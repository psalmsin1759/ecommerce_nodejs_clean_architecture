import { User, Address } from "../entities/User";

export interface UserRepository {
  
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;


  findByEmail(email: string): Promise<User | null>;
  findByPhone(phoneNumber: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  updateLastLogin(id: string, ip: string): Promise<void>;


  verifyEmail(id: string): Promise<void>;
  verifyPhone(id: string): Promise<void>;


  setPasswordResetToken(id: string, token: string, expiresAt: string): Promise<void>;
  clearPasswordResetToken(id: string): Promise<void>;
  findByPasswordResetToken(token: string): Promise<User | null>;


  addAddress(userId: string, address: Address): Promise<User>;
  updateAddress(userId: string, addressId: string, updates: Partial<Address>): Promise<User>;
  removeAddress(userId: string, addressId: string): Promise<User>;
  setDefaultAddress(userId: string, addressId: string, type: "billing" | "shipping"): Promise<User>;


  updateStatus(id: string, status: "active" | "inactive" | "banned" | "pendingVerification"): Promise<void>;
  softDelete(id: string): Promise<void>; 
  restore(id: string): Promise<void>; 
}
