import { ProductRepository } from "../../../domain/repositories/ProductRepository";
import { Product } from "../../../domain/entities/Product";

export class GetProductBySlug {
  constructor(private productRepository: ProductRepository) {}

  async execute(slug: string): Promise<Product | null> {
    return await this.productRepository.getBySlug(slug);
  }
}
