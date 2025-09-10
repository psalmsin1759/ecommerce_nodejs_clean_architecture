import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import { CreateAdminDTO } from "../../dto/admin/AdminDTO";
import { Admin } from "../../../domain/entities/Admin";
import bcrypt from "bcryptjs";

export class CreateAdminUseCase {
  constructor(private repo: AdminRepository) {}

  async execute(dto: CreateAdminDTO): Promise<Admin> {
    const existingEmail = await this.repo.findByEmail(dto.email);
    if (existingEmail) throw new Error("Email already in use");
    const existingUsername = await this.repo.findByUsername(dto.username!);
    if (existingUsername) throw new Error("Username already in use");

    const id = `adm_${Math.floor(Math.random() * 1000000)}`;
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const now = new Date().toISOString();

    const admin: Admin = {
      id,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      fullName: dto.fullName,
      passwordHash,
      roles: dto.roles || [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    return this.repo.create(admin);
  }
}
