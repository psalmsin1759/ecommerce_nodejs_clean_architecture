import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { Product } from "@/domain/entities/Product";

export class GetAllProducts {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }
}
