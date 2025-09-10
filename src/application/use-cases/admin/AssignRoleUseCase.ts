import { AdminRepository } from "../../../domain/repositories/AdminRepository";

export class AssignRoleUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(adminId: string, role: any) {
    const admin = await this.repo.findById(adminId);
    if (!admin) throw new Error("Admin not found");
    const roles = admin.roles || [];
    if (!roles.find((r) => r.id === role.id)) roles.push(role);
    await this.repo.update(adminId, { roles } as any);
    return this.repo.findById(adminId);
  }
}
