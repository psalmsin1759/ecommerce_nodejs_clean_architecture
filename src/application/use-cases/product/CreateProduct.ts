import { ProductRepository } from "../../../domain/repositories/ProductRepository";
import { Product } from "../../../domain/entities/Product";
import { CreateProductDTO } from "../../../application/dto/product/CreateProductDTO";

export class CreateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    return await this.productRepository.create(data);
  }
}
