import { CategoryRepository } from "@/src/domain/repositories/CategoryRepository";
import { CreateCategoryDTO } from "@/src/application/dto/CategoryDTO";

export class CreateCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(data: CreateCategoryDTO) {
    return this.categoryRepo.create(data);
  }
}
