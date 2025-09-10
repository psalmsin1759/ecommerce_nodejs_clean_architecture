import express from "express";
import { AdminController } from "../controllers/AdminController";
import { z } from "zod";
import {
  CreateAdminValidator,
  UpdateAdminValidator,
  LoginValidator,
  ChangePasswordValidator,
  AssignRoleValidator,
} from "../../../application/validators/AdminValidator";

const adminRouter = express.Router();
const controller = new AdminController();

function validate(
  schema: z.ZodSchema<any>,
  property: "body" | "query" | "params" = "body"
) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    req[property] = result.data;
    next();
  };
}



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateAdminDTO"
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Admin"
 */
/* adminRouter.post("/", validate(CreateAdminValidator), (req, res) =>
  controller.create(req, res)
); */


adminRouter.post("/", (req, res) =>
  controller.create(req, res)
);


/**
 * @swagger
 * /admins/login:
 *   post:
 *     summary: Login an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginAdminDTO"
 *     responses:
 *       200:
 *         description: JWT token and admin profile
 */
/* adminRouter.post("/login", validate(LoginValidator), (req, res) =>
  controller.login(req, res)
); */

adminRouter.post("/login", (req, res) =>
  controller.login(req, res)
);

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Admin"
 */
adminRouter.get("/", (req, res) => controller.list(req, res));

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Admin"
 *       404:
 *         description: Admin not found
 */
adminRouter.get("/:id", (req, res) => controller.get(req, res));

/**
 * @swagger
 * /admins/{id}:
 *   patch:
 *     summary: Update an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateAdminDTO"
 *     responses:
 *       200:
 *         description: Updated admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Admin"
 */
adminRouter.patch("/:id", validate(UpdateAdminValidator), (req, res) =>
  controller.update(req, res)
);

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Admin deleted successfully
 */
adminRouter.delete("/:id", (req, res) => controller.remove(req, res));

/**
 * @swagger
 * /admins/{id}/change-password:
 *   post:
 *     summary: Change admin password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordDTO"
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
adminRouter.post(
  "/:id/change-password",
  validate(ChangePasswordValidator),
  (req, res) => controller.changePassword(req, res)
);

/**
 * @swagger
 * /admins/{id}/assign-role:
 *   post:
 *     summary: Assign role to an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AssignRoleDTO"
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
adminRouter.post(
  "/:id/assign-role",
  validate(AssignRoleValidator),
  (req, res) => controller.assignRole(req, res)
);

export default adminRouter;
