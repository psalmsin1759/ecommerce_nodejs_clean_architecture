import { AdminRepository } from "../../../domain/repositories/AdminRepository";

export class ListAdminsUseCase {
  constructor(private repo: AdminRepository) {}
  async execute(filter?: any) {
    return this.repo.list(filter);
  }
}
