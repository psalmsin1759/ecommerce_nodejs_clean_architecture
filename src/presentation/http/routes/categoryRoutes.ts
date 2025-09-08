import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const categoryRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Shoes"
 *               description:
 *                 type: string
 *                 example: "All kinds of shoes"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
//categoryRouter.post("/", authMiddleware, CategoryController.create);
categoryRouter.post("/", CategoryController.create);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
categoryRouter.get("/", CategoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sneakers"
 *               description:
 *                 type: string
 *                 example: "Casual sneakers"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
//categoryRouter.put("/:id", authMiddleware, CategoryController.update);
categoryRouter.put("/:id", CategoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
//categoryRouter.delete("/:id", authMiddleware, CategoryController.delete);
categoryRouter.delete("/:id", CategoryController.delete);

export default categoryRouter;
