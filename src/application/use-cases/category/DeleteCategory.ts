import { CategoryRepository } from "@/domain/repositories/CategoryRepository";

export class DeleteCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(id: string) {
    return this.categoryRepo.delete(id);
  }
}
