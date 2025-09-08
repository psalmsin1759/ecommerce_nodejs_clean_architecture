import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { Product } from "@/domain/entities/Product";

export class GetProductById {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return await this.productRepository.getById(id);
  }
}
