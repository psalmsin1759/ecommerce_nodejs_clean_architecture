import { ProductRepository } from "../../../domain/repositories/ProductRepository";
import { Product } from "../../../domain/entities/Product";

export class GetProductsByCategory {
  constructor(private productRepository: ProductRepository) {}

  async execute(categoryId: string): Promise<Product[]> {
    return await this.productRepository.getByCategory(categoryId);
  }
}
