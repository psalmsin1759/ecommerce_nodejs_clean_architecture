import { CategoryRepository } from "@/domain/repositories/CategoryRepository";
import { UpdateCategoryDTO } from "@/application/dto/CategoryDTO";

export class UpdateCategory {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO) {
    return this.categoryRepo.update(id, data);
  }
}
