import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import bcrypt from "bcryptjs";

export class ChangePasswordUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(
    adminId: string,
    oldPassword: string | undefined,
    newPassword: string
  ) {
    const admin = await this.repo.findById(adminId);
    if (!admin) throw new Error("Admin not found");
    if (oldPassword) {
      if (!admin.passwordHash) throw new Error("No password set");
      const ok = await bcrypt.compare(oldPassword, admin.passwordHash);
      if (!ok) throw new Error("Old password incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.repo.setPassword(adminId, newHash);
    return true;
  }
}
