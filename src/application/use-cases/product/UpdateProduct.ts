import { ProductRepository } from "../../../domain/repositories/ProductRepository";
import { Product } from "../../../domain/entities/Product";
import { UpdateProductDTO } from "../../../application/dto/product/UpdateProductDTO";

export class UpdateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product | null> {
    return await this.productRepository.update(id, data);
  }
}
