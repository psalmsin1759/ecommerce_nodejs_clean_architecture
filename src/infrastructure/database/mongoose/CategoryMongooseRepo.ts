import { Category } from "@/src/domain/entities/Category";
import { CategoryRepository } from "@/src/domain/repositories/CategoryRepository";
import { CategoryModel } from "./models/CategoryModel";

export class CategoryMongooseRepo implements CategoryRepository {
  async create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt" | "slug">
  ): Promise<Category> {
    
    const slug = data.name!
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")   // replace spaces with -
      .replace(/[^\w-]+/g, ""); // remove special chars (optional)

    const category = await CategoryModel.create({
      ...data,
      slug,
    });

    return this.toEntity(category);
  }

  async getAll(): Promise<Category[]> {
    const categories = await CategoryModel.find();
    return categories.map(this.toEntity);
  }

  async update(id: string, data: Partial<Category>): Promise<Category | null> {
    const category = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    return category ? this.toEntity(category) : null;
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }

  private toEntity(doc: any): Category {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
