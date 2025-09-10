import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import { Admin } from "../../../domain/entities/Admin";

export class GetAdminUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(id: string): Promise<Admin | null> {
    return this.repo.findById(id);
  }
}
