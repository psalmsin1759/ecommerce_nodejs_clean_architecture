import { CategoryRepository } from "@/domain/repositories/CategoryRepository";
import { CreateCategoryDTO } from "@/application/dto/CategoryDTO";

export class CreateCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(data: CreateCategoryDTO) {
    return this.categoryRepo.create(data);
  }
}
