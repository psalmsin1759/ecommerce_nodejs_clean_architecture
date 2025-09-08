import { ProductRepository } from "@/src/domain/repositories/ProductRepository";
import { Product } from "@/src/domain/entities/Product";

export class GetProductBySlug {
  constructor(private productRepository: ProductRepository) {}

  async execute(slug: string): Promise<Product | null> {
    return await this.productRepository.getBySlug(slug);
  }
}
