import { Category } from "../../domain/entities/Category";

export interface CreateCategoryDTO {
  name?: string ;
  description?: string | undefined; 
}

export interface UpdateCategoryDTO {
  name?: string | undefined;
  description?: string | undefined; 
}

export interface CategoryResponseDTO {
  id: string;
  name?: string | undefined;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class CategoryMapper {
  static toDTO(entity: Category): CategoryResponseDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description!,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
