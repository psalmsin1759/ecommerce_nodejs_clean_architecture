import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import bcrypt from "bcryptjs";

export class LoginUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(email: string, password: string) {
    const admin =await this.repo.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");
    if (!admin.passwordHash) throw new Error("Admin has no password set");
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) throw new Error("Invalid credentials");

   
    await this.repo.recordLogin(admin.id);

    // issue JWT token here using  auth service placeholder
    const token = `jwt-placeholder-for-${admin.id}`;
    return { admin, token };
  }
}
