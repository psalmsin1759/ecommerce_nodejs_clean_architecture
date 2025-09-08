import { ProductRepository } from "@/src/domain/repositories/ProductRepository";
import { Product } from "@/src/domain/entities/Product";
import { UpdateProductDTO } from "@/src/application/dto/product/UpdateProductDTO";

export class UpdateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product | null> {
    return await this.productRepository.update(id, data);
  }
}
