import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import bcrypt from "bcryptjs";
import { JwtService } from "../../../infrastructure/security/JwtService";

export class LoginUseCase {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly jwtService: JwtService
  ) {}
  async execute(email: string, password: string) {
    const admin =await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");
    if (!admin.passwordHash) throw new Error("Admin has no password set");
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) throw new Error("Invalid credentials");

   
    await this.adminRepo.recordLogin(admin.id);

    const token = this.jwtService.sign({ id: admin.id, email: admin.email, roles: admin.roles });

    return { admin, token };
  }
}
