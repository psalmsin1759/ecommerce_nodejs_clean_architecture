import { CategoryRepository } from "@/domain/repositories/CategoryRepository";

export class GetAllCategories {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute() {
    return this.categoryRepo.getAll();
  }
}
