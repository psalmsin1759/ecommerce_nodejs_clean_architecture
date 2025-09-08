import { ProductRepository } from "../../../domain/repositories/ProductRepository";

export class DeleteProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    return await this.productRepository.delete(id);
  }
}
