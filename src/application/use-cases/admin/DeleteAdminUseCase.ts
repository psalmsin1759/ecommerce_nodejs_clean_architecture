import { AdminRepository } from "../../../domain/repositories/AdminRepository";

export class DeleteAdminUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(id: string) {
    return this.repo.delete(id);
  }
}
