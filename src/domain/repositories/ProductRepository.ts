import { CreateProductDTO } from "@/application/dto/product/CreateProductDTO";
import {UpdateProductDTO} from "@/application/dto/product/UpdateProductDTO";
import { Product } from "../entities/Product";

export interface ProductRepository {
  create(product: CreateProductDTO): Promise<Product>;
  update(id: string, product: Partial<UpdateProductDTO>): Promise<Product | null>;
  delete(id: string): Promise<void>;

  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;

  getAll(): Promise<Product[]>;

  getByCategory(categoryId: string): Promise<Product[]>;

  searchByName(query: string): Promise<Product[]>;

  updateStock(id: string, quantity: number): Promise<Product | null>;
}
