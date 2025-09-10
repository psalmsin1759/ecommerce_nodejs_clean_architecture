import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import { UpdateAdminDTO } from "../../dto/admin/AdminDTO";

export class UpdateAdminUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(id: string, dto: UpdateAdminDTO) {
    return this.repo.update(id, dto as any);
  }
}
