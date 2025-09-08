import { ProductRepository } from "@/src/domain/repositories/ProductRepository";
import { Product } from "@/src/domain/entities/Product";
import { ProductModel, ProductDocument } from "./models/ProductModel";

export class ProductMongooseRepo implements ProductRepository {
  async create(product: Product): Promise<Product> {
    const created = new ProductModel(product);
    await created.save();
    return created.toObject<Product>();
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updated = await ProductModel.findByIdAndUpdate(id, product, {
      new: true,
    })
      .lean<Product>()
      .exec();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id).exec();
  }

  async getById(id: string): Promise<Product | null> {
    return await ProductModel.findById(id).lean<Product>().exec();
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return await ProductModel.findOne({ slug }).lean<Product>().exec();
  }

  async getAll(): Promise<Product[]> {
    return await ProductModel.find().lean<Product[]>().exec();
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    return await ProductModel.find({ categories: categoryId })
      .lean<Product[]>()
      .exec();
  }

  async searchByName(query: string): Promise<Product[]> {
    return await ProductModel.find({
      name: { $regex: query, $options: "i" },
    })
      .lean<Product[]>()
      .exec();
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await ProductModel.findById(id).exec();
    if (!product) return null;

    product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
    product.isInStock = product.stockQuantity > 0;

    await product.save();
    return product.toObject<Product>();
  }
}
