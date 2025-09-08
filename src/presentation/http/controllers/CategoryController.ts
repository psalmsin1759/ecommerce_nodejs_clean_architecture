import { Request, Response } from "express";
import { CategoryMongooseRepo } from "../../../infrastructure/database/mongoose/CategoryMongooseRepo";
import { CreateCategory } from "../../../application/use-cases/category/CreateCategory";
import { GetAllCategories } from "../../../application/use-cases/category/GetAllCategories";
import { UpdateCategory } from "../../../application/use-cases/category/UpdateCategory";
import { DeleteCategory } from "../../../application/use-cases/category/DeleteCategory";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../../../application/validators/CategoryValidator";

const categoryRepo = new CategoryMongooseRepo();

export class CategoryController {
  static async create(req: Request, res: Response) {
    const parsed = CreateCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    const useCase = new CreateCategory(categoryRepo);
    const category = await useCase.execute(parsed.data);
    return res.status(201).json(category);
  }

  static async getAll(req: Request, res: Response) {
    const useCase = new GetAllCategories(categoryRepo);
    const categories = await useCase.execute();
    return res.json(categories);
  }

  static async update(req: Request, res: Response) {
    const parsed = UpdateCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Category ID is required" });
    const useCase = new UpdateCategory(categoryRepo);
    const updated = await useCase.execute(id, parsed.data);
    return res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Category ID is required" });
    const useCase = new DeleteCategory(categoryRepo);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
