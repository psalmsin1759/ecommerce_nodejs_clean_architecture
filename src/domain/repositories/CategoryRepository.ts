
import { CreateCategoryDTO, UpdateCategoryDTO } from "@/application/dto/CategoryDTO";
import { Category } from "../entities/Category";

export interface CategoryRepository {
  create(data: CreateCategoryDTO): Promise<Category>;
  getAll(): Promise<Category[]>;
  update(id: string, data: UpdateCategoryDTO): Promise<Category | null>;
  delete(id: string): Promise<void>;
}
