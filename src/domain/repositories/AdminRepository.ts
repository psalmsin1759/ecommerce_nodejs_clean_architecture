import { Admin } from "../entities/Admin";

export interface AdminFilter {
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminRepository {
  create(admin: Admin): Promise<Admin>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  findByUsername(username: string): Promise<Admin | null>;
  update(id: string, update: Partial<Admin>): Promise<Admin | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: AdminFilter): Promise<{ items: Admin[]; total: number }>;

  setPassword(id: string, passwordHash: string): Promise<void>;
  recordLogin(id: string): Promise<void>;
}
