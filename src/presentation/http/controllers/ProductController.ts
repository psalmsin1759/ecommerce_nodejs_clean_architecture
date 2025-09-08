import { Request, Response } from "express";
import { ProductMongooseRepo } from "@/src/infrastructure/database/mongoose/ProductMongooseRepo";
import { CreateProductSchema, UpdateProductSchema } from "@/src/application/validators/ProductValidator";
import { CreateProduct } from "@/src/application/use-cases/product/CreateProduct";
import { GetProductById } from "@/src/application/use-cases/product/GetProductById";
import { GetProductBySlug } from "@/src/application/use-cases/product/GetProductBySlug";
import { GetProductsByCategory } from "@/src/application/use-cases/product/GetProductsByCategory";
import { GetAllProducts } from "@/src/application/use-cases/product/GetAllProducts";
import { UpdateProduct } from "@/src/application/use-cases/product/UpdateProduct";
import { DeleteProduct } from "@/src/application/use-cases/product/DeleteProduct";

const productRepo = new ProductMongooseRepo();

export class ProductController {
  static async create(req: Request, res: Response) {
    const parsed = CreateProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    const useCase = new CreateProduct(productRepo);
    const product = await useCase.execute(parsed.data);
    return res.status(201).json(product);
  }

  static async getAll(req: Request, res: Response) {
    const useCase = new GetAllProducts(productRepo);
    const products = await useCase.execute();
    return res.json(products);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
     if (!id)
      return res.status(400).json({ message: "Product ID is required" });
    const useCase = new GetProductById(productRepo);
    const product = await useCase.execute(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  }

  static async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;
   
     if (!slug)
      return res.status(400).json({ message: "Product Slug is required" });
    const useCase = new GetProductBySlug(productRepo);
    const product = await useCase.execute(slug);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  }

  static async getByCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
     if (!categoryId)
      return res.status(400).json({ message: "Product Category is required" });
    const useCase = new GetProductsByCategory(productRepo);
    const products = await useCase.execute(categoryId);
    return res.json(products);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
     if (!id)
      return res.status(400).json({ message: "Product ID is required" });
    const parsed = UpdateProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    const useCase = new UpdateProduct(productRepo);
    const updated = await useCase.execute(id, parsed.data);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
     if (!id)
      return res.status(400).json({ message: "Product ID is required" });
    const useCase = new DeleteProduct(productRepo);
    
    await useCase.execute(id);
    return res.status(204).send();
  }
}
