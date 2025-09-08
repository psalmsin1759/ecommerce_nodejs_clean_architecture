import { ProductRepository } from "@/src/domain/repositories/ProductRepository";
import { Product } from "@/src/domain/entities/Product";
import { CreateProductDTO } from "@/src/application/dto/product/CreateProductDTO";

export class CreateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    return await this.productRepository.create(data);
  }
}
